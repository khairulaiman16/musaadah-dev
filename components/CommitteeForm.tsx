"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Calendar, Building2, ShieldCheck } from "lucide-react"

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
import { createCommitteeMember } from "@/lib/actions/jawatankuasa"
import { useToast } from "@/hooks/use-toast"

const committeeFormSchema = z.object({
  nama: z.string().min(2, "Nama penuh diperlukan"),
  jawatan: z.string().min(1, "Sila pilih jawatan"),
  agensi: z.string().min(1, "Sila pilih agensi"),
  noTelefon: z.string().min(10, "No. telefon tidak sah"),
  tarikhLantikan: z.string(),
  tempohLantikan: z.string(), // 1, 2, 3, or 4 years
  status: z.string(),
  disahkanOleh: z.string(), // Pengarah BD / TKPO Jakim
})

export default function CommitteeForm() {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof committeeFormSchema>>({
    resolver: zodResolver(committeeFormSchema),
    defaultValues: {
      nama: "",
      jawatan: "Ahli Jawatankuasa",
      agensi: "JAKIM",
      noTelefon: "",
      tarikhLantikan: new Date().toISOString().split('T')[0],
      tempohLantikan: "2",
      status: "Aktif",
      disahkanOleh: "Pengarah BD",
    },
  })

  async function onSubmit(values: z.infer<typeof committeeFormSchema>) {
    try {
      // Calculate Tarikh Tamat based on Tempoh
      const startDate = new Date(values.tarikhLantikan);
      const endDate = new Date(startDate);
      endDate.setFullYear(startDate.getFullYear() + parseInt(values.tempohLantikan));
      
      const completeData = {
        ...values,
        tarikhTamat: endDate.toISOString().split('T')[0]
      };

      await createCommitteeMember(completeData);
      
      toast({
        title: "Berjaya!",
        description: `Profil ${values.nama} telah didaftarkan.`,
      })
      form.reset();
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Ralat", description: "Gagal menyimpan data." })
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <ShieldCheck className="text-blue-600" size={24} />
        <h2 className="text-20 font-bold text-gray-900">Daftar Lantikan Baru</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Nama & Agensi */}
            <FormField control={form.control} name="nama" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-14 font-semibold">Nama Penuh</FormLabel>
                <FormControl><Input placeholder="Contoh: Ahmad Bin Ali" {...field} className="input-class" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="agensi" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-14 font-semibold">Agensi</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="input-class"><SelectValue placeholder="Pilih Agensi" /></SelectTrigger></FormControl>
                  <SelectContent className="bg-white">
                    {["JAKIM", "JAWI", "JAWHAR", "Yayasan Wakaf", "PDRM", "Yayasan Takwa", "MAIWP"].map(a => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )} />

            {/* Jawatan & Pengesahan */}
            <FormField control={form.control} name="jawatan" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-14 font-semibold">Jawatan</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="input-class"><SelectValue placeholder="Pilih Jawatan" /></SelectTrigger></FormControl>
                  <SelectContent className="bg-white">
                    {["Ketua Pengarah", "Timbalan Ketua Pengarah", "KKPK", "Pengerusi", "Ahli Jawatankuasa"].map(j => (
                      <SelectItem key={j} value={j}>{j}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )} />

            <FormField control={form.control} name="disahkanOleh" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-14 font-semibold">Pengesahan Oleh</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="input-class"><SelectValue placeholder="Pihak Berkuasa" /></SelectTrigger></FormControl>
                  <SelectContent className="bg-white">
                    <SelectItem value="Pengarah BD">Pengarah BD</SelectItem>
                    <SelectItem value="TKPO Jakim">TKPO Jakim</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )} />

            {/* Tarikh & Tempoh */}
            <FormField control={form.control} name="tarikhLantikan" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-14 font-semibold">Tarikh Lantikan</FormLabel>
                <FormControl><Input type="date" {...field} className="input-class" /></FormControl>
              </FormItem>
            )} />

            <FormField control={form.control} name="tempohLantikan" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-14 font-semibold">Tempoh (Tahun)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="input-class"><SelectValue placeholder="Pilih Tempoh" /></SelectTrigger></FormControl>
                  <SelectContent className="bg-white">
                    <SelectItem value="1">1 Tahun</SelectItem>
                    <SelectItem value="2">2 Tahun</SelectItem>
                    <SelectItem value="3">3 Tahun</SelectItem>
                    <SelectItem value="4">4 Tahun</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )} />
          </div>

          <Button type="submit" disabled={form.formState.isSubmitting} className="form-btn w-full mt-4 bg-blue-600 text-white hover:bg-blue-700">
            {form.formState.isSubmitting ? <><Loader2 size={20} className="animate-spin mr-2" /> Menyimpan...</> : "Simpan Rekod Lantikan"}
          </Button>
        </form>
      </Form>
    </div>
  )
}