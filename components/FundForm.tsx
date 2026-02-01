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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { createPenerimaanDana } from "@/lib/actions/dana.actions"
import { FundFormSchema } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast" // Ensure your hook path is correct

export default function FundForm() {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FundFormSchema>>({
    resolver: zodResolver(FundFormSchema),
    defaultValues: {
      jenisDana: "Sumbangan",
      kaedahBayaran: "Tunai",
      tarikhMasuk: new Date().toISOString().split('T')[0],
      kategoriPenyumbang: "Individu",
      bank: "Bank Islam",
      jumlah: "",
      namaPenyumbang: "",
      noRujukan: "",
    },
  })

  async function onSubmit(values: z.infer<typeof FundFormSchema>) {
    try {
      const res = await createPenerimaanDana(values);
      
      if(res) {
        // Success Toast with green border
        toast({
          title: "REKOD BERJAYA DISIMPAN!",
          description: `Sumbangan daripada ${values.namaPenyumbang} telah direkodkan.`,
          className: "bg-white border-l-4 border-green-500 shadow-md",
        })
        form.reset();
      } else {
        throw new Error("Gagal menyimpan data");
      }
    } catch (error) {
      // Error Toast with red variant
      toast({
        variant: "destructive",
        title: "RALAT SISTEM",
        description: "Gagal menyimpan rekod. Sila semak sambungan internet atau hubungi admin.",
      })
    }
  }

  return (
    <div className="flex flex-col gap-8 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex flex-col gap-1">
        <h2 className="text-24 font-bold text-gray-900">Penerimaan Dana (Musa'adah)</h2>
        <p className="text-14 text-gray-600 font-normal">Sila masukkan butiran sumbangan atau geran yang diterima.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Nama Penyumbang */}
            <FormField
              control={form.control}
              name="namaPenyumbang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-14 font-semibold text-gray-700">Nama Penyumbang</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama penuh / Syarikat" {...field} className="input-class" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* Jumlah */}
            <FormField
              control={form.control}
              name="jumlah"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-14 font-semibold text-gray-700">Jumlah RM</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} className="input-class" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* Jenis Dana */}
            <FormField
              control={form.control}
              name="jenisDana"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-14 font-semibold text-gray-700">Jenis Dana</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="input-class">
                        <SelectValue placeholder="Pilih jenis" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="Sumbangan">Sumbangan / Derma</SelectItem>
                      <SelectItem value="Peruntukan">Peruntukan Khas</SelectItem>
                      <SelectItem value="Yayasan">Yayasan Taqwa</SelectItem>
                      <SelectItem value="Baitulmal">Baitulmal</SelectItem>
                      <SelectItem value="Kutipan">Kutipan Jumaat</SelectItem>
                      <SelectItem value="SDK">SDK</SelectItem>
                      <SelectItem value="Sedekah">Sedekah</SelectItem>
                      <SelectItem value="Hibah">Hibah</SelectItem>
                    
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kategori Penyumbang */}
            <FormField
              control={form.control}
              name="kategoriPenyumbang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-14 font-semibold text-gray-700">Kategori Penyumbang</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="input-class">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="Individu">Individu</SelectItem>
                      <SelectItem value="Syarikat/Korporat">Syarikat/Korporat</SelectItem>
                      <SelectItem value="Agensi Kerajaan">Agensi Kerajaan</SelectItem>
                      <SelectItem value="NGO">NGO</SelectItem>
                      <SelectItem value="Kedutaan">Kedutaan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kaedah Bayaran */}
            <FormField
              control={form.control}
              name="kaedahBayaran"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-14 font-semibold text-gray-700">Kaedah Bayaran</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="input-class">
                        <SelectValue placeholder="Pilih kaedah" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="Tunai">Tunai</SelectItem>
                      <SelectItem value="Online Transfer">Online Transfer</SelectItem>
                      <SelectItem value="QR Code">QR Code</SelectItem>
                      <SelectItem value="Cek">Cek</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bank */}
            <FormField
              control={form.control}
              name="bank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-14 font-semibold text-gray-700">Bank (Jika Berkaitan)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="input-class">
                        <SelectValue placeholder="Pilih bank" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="Bank Islam">Bank Islam</SelectItem>
                      <SelectItem value="Maybank">Maybank</SelectItem>
                      <SelectItem value="CIMB">CIMB</SelectItem>
                      <SelectItem value="Bank Rakyat">Bank Rakyat</SelectItem>
                      <SelectItem value="Lain-lain">Lain-lain</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tarikh Masuk */}
            <FormField
              control={form.control}
              name="tarikhMasuk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-14 font-semibold text-gray-700">Tarikh Masuk</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="input-class" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* No Rujukan */}
            <FormField
              control={form.control}
              name="noRujukan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-14 font-semibold text-gray-700">No. Rujukan / Resit</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: RES-12345" {...field} className="input-class" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

         <Button 
  type="submit" 
  disabled={form.formState.isSubmitting} 
  className="form-btn w-full mt-4"
>
  {form.formState.isSubmitting ? (
    <>
      <Loader2 size={20} className="animate-spin mr-2" />
      Menyimpan...
    </>
  ) : (
    "Simpan Rekod Dana"
  )}
</Button>
        </form>
      </Form>
    </div>
  )
}