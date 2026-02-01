"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createAgihanDana } from "@/lib/actions/wang-keluar.actions"
import { useToast } from "@/hooks/use-toast"

// 1. Added status to the schema
const formSchema = z.object({
  tujuan: z.string().min(2, "Tujuan diperlukan"),
  penerima: z.string().min(2, "Nama penerima diperlukan"),
  jumlah: z.string().min(1, "Jumlah diperlukan"),
  kategoriPenerima: z.string(),
  kaedahBayaran: z.string(),
  tarikhKeluar: z.string(),
  status: z.string().optional(), 
})

export default function DisbursementForm() {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tujuan: "",
      penerima: "",
      jumlah: "",
      kategoriPenerima: "Asnaf",
      kaedahBayaran: "EFT",
      tarikhKeluar: new Date().toISOString().split('T')[0],
      status: "pending", // 2. Default value for the form state
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // 3. Explicitly sending "pending" to Appwrite
      const res = await createAgihanDana({
        ...values,
        status: "pending" 
      });
      
      if(res) {
        toast({
          title: "PERMOHONAN DIHANTAR",
          description: `Permohonan untuk ${values.penerima} kini berstatus PENDING untuk kelulusan.`,
          className: "bg-white border-l-4 border-blue-500 shadow-md",
        })
        form.reset();
      } else {
        throw new Error("Gagal menyimpan");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "RALAT PENYIMPANAN",
        description: error.message || "Gagal merekodkan permohonan. Sila cuba lagi.",
      })
    }
  }

  return (
    <div className="mx-auto w-full max-w-[850px] flex flex-col gap-8 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h2 className="text-24 font-bold text-gray-900">Agihan Baru (Wang Keluar)</h2>
        <p className="text-14 text-gray-500 font-normal">Sila masukkan butiran permohonan agihan dana untuk kelulusan pentadbir.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            
            <FormField
              control={form.control}
              name="tujuan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-14 font-semibold text-gray-700">Tujuan / Nama Program</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Bantuan Musim Tengkujuh" {...field} className="input-class h-11" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="penerima"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-14 font-semibold text-gray-700">Nama Penerima</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama individu atau organisasi" {...field} className="input-class h-11" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jumlah"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-14 font-semibold text-gray-700">Jumlah Agihan (RM)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} className="input-class h-11 text-red-600 font-bold" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kategoriPenerima"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-14 font-semibold text-gray-700">Kategori Penerima</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="input-class h-11">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="Asnaf">Asnaf</SelectItem>
                      <SelectItem value="Mangsa Bencana">Mangsa Bencana</SelectItem>
                      <SelectItem value="NGO / Kelab">NGO / Kelab</SelectItem>
                      <SelectItem value="Lain-lain">Lain-lain</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tarikhKeluar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-14 font-semibold text-gray-700">Tarikh Cadangan Agihan</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="input-class h-11" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kaedahBayaran"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-14 font-semibold text-gray-700">Kaedah Pembayaran</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="input-class h-11">
                        <SelectValue placeholder="Pilih kaedah" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="EFT">Online Transfer (EFT)</SelectItem>
                      <SelectItem value="Cek">Cek</SelectItem>
                      <SelectItem value="Tunai">Tunai</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting} 
            className="form-btn w-full h-12 text-16 font-bold bg-blue-600 hover:bg-blue-700 text-white"
          >
            {form.formState.isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 size={20} className="animate-spin" />
                <span>Menghantar Permohonan...</span>
              </div>
            ) : "Hantar Permohonan Agihan"}
          </Button>
        </form>
      </Form>
    </div>
  )
}