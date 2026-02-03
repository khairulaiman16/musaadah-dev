"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, FileUp } from "lucide-react" // Added FileUp icon
import { useState } from "react"

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
import { Textarea } from "@/components/ui/textarea" // Added for remarks
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createAgihanDana } from "@/lib/actions/wang-keluar.actions"
import { useToast } from "@/hooks/use-toast"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// 1. Added status, file, and remark to the schema
const formSchema = z.object({
  tujuan: z.string().min(2, "Tujuan diperlukan"),
  penerima: z.string().min(2, "Nama penerima diperlukan"),
  jumlah: z.string().min(1, "Jumlah diperlukan"),
  kategoriPenerima: z.string(),
  kaedahBayaran: z.string(),
  tarikhKeluar: z.string(),
  status: z.string().optional(),
  file: z.any().optional(), // Added for document upload
  remark: z.string().optional(), // Added for officer remarks
})

// Added props for accountability
export default function DisbursementForm({ userId, userName }: { userId: string, userName: string }) {
  const { toast } = useToast()
  const [showConfirm, setShowConfirm] = useState(false);
  const [tempValues, setTempValues] = useState<z.infer<typeof formSchema> | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tujuan: "",
      penerima: "",
      jumlah: "",
      kategoriPenerima: "Asnaf",
      kaedahBayaran: "EFT",
      tarikhKeluar: new Date().toISOString().split('T')[0],
      status: "pending", 
      remark: "", // Initialize remark
    },
  })

  // Triggered when button is clicked (before actual submission)
  function handlePreSubmit(values: z.infer<typeof formSchema>) {
    setTempValues(values);
    setShowConfirm(true);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // 3. Switch to FormData to support file uploads
      const formData = new FormData();
      formData.append('tujuan', values.tujuan);
      formData.append('penerima', values.penerima);
      formData.append('jumlah', values.jumlah);
      formData.append('kategoriPenerima', values.kategoriPenerima);
      formData.append('kaedahBayaran', values.kaedahBayaran);
      formData.append('tarikhKeluar', values.tarikhKeluar);
      formData.append('status', 'pending');
      formData.append('remark', values.remark || ""); // Append remark
      formData.append('urussetiaId', userId); // For accountability
      formData.append('urussetiaName', userName);

      if (values.file && values.file[0]) {
        formData.append('file', values.file[0]); // Append actual file
      }

      const res = await createAgihanDana(formData);
      
      if(res) {
        toast({
          title: "PERMOHONAN DIHANTAR",
          description: `Permohonan untuk ${values.penerima} kini berstatus PENDING untuk kelulusan.`,
          className: "bg-white border-l-4 border-blue-500 shadow-md",
        })
        form.reset();
        setShowConfirm(false);
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
        <p className="text-14 text-gray-500 font-normal">Pegawai Bertanggungjawab: <span className="font-bold text-blue-600 uppercase">{userName}</span></p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePreSubmit)} className="space-y-8">
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
                  <FormLabel className="text-14 font-semibold text-gray-700">Jumlah Agihan (RM) </FormLabel>
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

            {/* NEW: Remark Field - Full Width */}
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-14 font-semibold text-gray-700">Nota / Remark (Jika ada)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Masukkan maklumat tambahan atau catatan untuk permohonan ini..." 
                      className="resize-none bg-gray-50 border-gray-200 focus:bg-white" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* NEW: File Upload Field */}
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-14 font-semibold text-gray-700">Dokumen Sokongan (PDF/Imej)</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FileUp className="w-6 h-6 mb-2 text-gray-400" />
                          <p className="text-xs text-gray-500"><span className="font-semibold">Klik untuk muat naik</span></p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => onChange(e.target.files)} 
                          accept="image/*,application/pdf"
                        />
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
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

      {/* --- DOUBLE CONFIRMATION DIALOG --- */}
     <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="bg-white rounded-lg border border-gray-200 shadow-lg max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-16 font-semibold text-gray-900">
              Sahkan Penghantaran
            </AlertDialogTitle>
            <AlertDialogDescription className="text-14 text-gray-500 pt-1">
              Adakah anda pasti maklumat agihan ini telah disemak dan sedia untuk dihantar bagi proses kelulusan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4 gap-2">
            <AlertDialogCancel className="border-gray-200 text-gray-500 hover:bg-gray-50 font-medium text-12 px-4 h-9">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => tempValues && onSubmit(tempValues)}
              className="bg-blue-600 hover:bg-blue-700 !text-white font-medium text-12 px-4 h-9 border-none"
            >
              Sahkan & Hantar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}