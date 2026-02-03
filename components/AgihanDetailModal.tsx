"use client"

import { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { 
  Calendar, User, FileText, Tag, CreditCard, 
  Pencil, Save, X, Loader2, Printer 
} from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateAgihanDana } from "@/lib/actions/wang-keluar.actions"
import { useToast } from "@/hooks/use-toast"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

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


export default function AgihanDetailModal({ 
  isOpen, 
  onClose, 
  item 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  item: any 
}) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [formData, setFormData] = useState<any>(null)
  const printRef = useRef<HTMLDivElement>(null)
  const [showEditConfirm, setShowEditConfirm] = useState(false)

  useEffect(() => {
    if (item) setFormData({ ...item });
  }, [item])

  if (!item || !formData) return null;

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    const element = printRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Permohonan_Agihan_${formData.penerima.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      toast({ variant: "destructive", title: "Ralat PDF", description: "Gagal menjana dokumen." });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await updateAgihanDana(item.$id, formData);
      if (res) {
        toast({ title: "KEMASKINI BERJAYA", description: "Data agihan telah dikemaskini." });
        setIsEditing(false)
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Ralat", description: "Gagal mengemaskini data." })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) { setIsEditing(false); onClose(); } }}>
      <DialogContent className="bg-white max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header Section */}
        <div className="bg-slate-50 px-8 py-6 border-b border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1 flex-1">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Dokumen Agihan Dana</p>
              {isEditing ? (
                <Input 
                  value={formData.penerima} 
                  onChange={(e) => setFormData({...formData, penerima: e.target.value})}
                  className="text-18 font-bold h-9 mt-1"
                />
              ) : (
                <DialogTitle className="text-24 font-black text-gray-900 leading-tight">
                  {formData.penerima}
                </DialogTitle>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(!isEditing)}
                className={cn("h-8 w-8 rounded-full", isEditing ? "text-red-500 hover:bg-red-50" : "text-gray-400 hover:bg-blue-50 hover:text-blue-600")}
              >
                {isEditing ? <X size={16} /> : <Pencil size={16} />}
              </Button>
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm",
                item.status === 'approved' ? "bg-green-500 text-white" :
                item.status === 'rejected' ? "bg-red-500 text-white" :
                "bg-orange-500 text-white"
              )}>
                {item.status || 'PENDING'}
              </span>
            </div>
          </div>
          
          <div className="flex gap-4">
             <div className="flex items-center gap-1.5 text-12 text-gray-500 font-medium">
                <Calendar size={14} />
                {new Date(item.$createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
             </div>
             <div className="flex items-center gap-1.5 text-12 text-gray-500 font-mono italic">
                #{item.$id.slice(-8).toUpperCase()}
             </div>
          </div>
        </div>

        {/* Body Section */}
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Tujuan / Program</span>
              {isEditing ? (
                <Input value={formData.tujuan} onChange={(e) => setFormData({...formData, tujuan: e.target.value})} className="h-8 text-13" />
              ) : (
                <p className="text-14 font-semibold text-gray-700 leading-relaxed">{formData.tujuan}</p>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Jumlah Agihan</span>
              {isEditing ? (
                <Input type="number" value={formData.jumlah} onChange={(e) => setFormData({...formData, jumlah: e.target.value})} className="h-8 text-13 font-bold text-blue-900" />
              ) : (
                <p className="text-20 font-black text-blue-900">RM {Number(formData.jumlah).toLocaleString('en-MY', { minimumFractionDigits: 2 })}</p>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Kategori & Kaedah</span>
              {isEditing ? (
                <Select value={formData.kategoriPenerima} onValueChange={(v) => setFormData({...formData, kategoriPenerima: v})}>
                  <SelectTrigger className="h-8 text-12"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Asnaf">Asnaf</SelectItem>
                    <SelectItem value="Mangsa Bencana">Mangsa Bencana</SelectItem>
                    <SelectItem value="NGO / Kelab">NGO / Kelab</SelectItem>
                    <SelectItem value="Lain-lain">Lain-lain</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex flex-col gap-1">
                  <p className="text-13 text-gray-600 flex items-center gap-2 font-medium"><Tag size={12} className="text-blue-500" /> {formData.kategoriPenerima}</p>
                  <p className="text-13 text-gray-600 flex items-center gap-2 font-medium"><CreditCard size={12} className="text-blue-500" /> {formData.kaedahBayaran}</p>
                </div>
              )}
              
              <div className="mt-3 pt-3 border-t border-gray-50">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Nota / Remark</span>
                {isEditing ? (
                  <Textarea value={formData.remark} onChange={(e) => setFormData({...formData, remark: e.target.value})} className="text-12 mt-1 min-h-[60px]" />
                ) : (
                  <p className="text-12 text-gray-600 italic leading-snug mt-1">{formData.remark || 'Tiada nota tambahan.'}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Tarikh Cadangan Agihan</span>
              {isEditing ? (
                <Input type="date" value={formData.tarikhKeluar} onChange={(e) => setFormData({...formData, tarikhKeluar: e.target.value})} className="h-8 text-12" />
              ) : (
                <p className="text-14 font-bold text-gray-700">{new Date(formData.tarikhKeluar).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!isEditing && (
              <Button 
                onClick={handleDownloadPDF} 
                disabled={isDownloading}
                className="flex-1 bg-slate-800 hover:bg-black text-white font-bold gap-2"
              >
                {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Printer size={18} />}
                CETAK PERMOHONAN (PDF)
              </Button>
            )}
            {isEditing && (
              <Button 
                onClick={() => setShowEditConfirm(true)} // Trigger Dialog
                disabled={isSaving} 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
                Simpan Perubahan
              </Button>
            )}
          </div>

          <div className="bg-blue-50/50 rounded-xl p-4 flex items-center justify-between border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white"><User size={18} /></div>
              <div>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">Disediakan Oleh</p>
                <p className="text-14 font-bold text-gray-900 uppercase">{formData.urussetiaName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- HIDDEN PDF TEMPLATE --- */}
        <div className="absolute left-[-9999px] top-0">
          <div ref={printRef} className="w-[210mm] p-[20mm] bg-white text-black font-sans relative">
            
            {/* BIG STATUS STAMP - Positioned Absolute */}
            <div className={cn(
              "absolute top-[40mm] right-[20mm] border-[6px] px-8 py-2 rounded-xl rotate-[-15deg] opacity-20 text-40 font-black uppercase tracking-tighter",
              formData.status === 'approved' ? "border-green-600 text-green-600" :
              formData.status === 'rejected' ? "border-red-600 text-red-600" :
              "border-orange-600 text-orange-600"
            )}>
              {formData.status === 'approved' ? 'LULUS' : formData.status === 'rejected' ? 'DITOLAK' : formData.status || 'PENDING'}
            </div>

            <div className="border-b-4 border-black pb-6 mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-32 font-black uppercase tracking-tighter">Voucher Pembayaran</h1>
                <p className="text-14 text-gray-600 font-mono italic">REF: #{formData.$id.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-16">TARIKH: {new Date().toLocaleDateString('en-GB')}</p>
                <p className="text-12 uppercase font-bold text-gray-900">Status: {formData.status?.toUpperCase() || 'PENDING'}</p>
              </div>
            </div>

            <div className="space-y-10">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-2">
                  <p className="text-12 font-bold text-gray-400 uppercase">Penerima Dana</p>
                  <p className="text-20 font-bold border-b-2 border-gray-100 pb-2">{formData.penerima}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-12 font-bold text-gray-400 uppercase">Jumlah Pembayaran</p>
                  <p className="text-24 font-black text-blue-700">RM {Number(formData.jumlah).toLocaleString('en-MY', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <p className="text-12 font-bold text-gray-400 uppercase mb-2">Butiran Program / Tujuan</p>
                  <p className="text-16 leading-relaxed font-medium">{formData.tujuan}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <p className="text-14"><strong>Kategori:</strong> {formData.kategoriPenerima}</p>
                  <p className="text-14"><strong>Kaedah:</strong> {formData.kaedahBayaran}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <p className="text-12 font-bold text-gray-400 uppercase mb-2">Nota / Remarks</p>
                <p className="text-14 italic text-gray-700">{formData.remark || 'Tiada catatan tambahan.'}</p>
              </div>

              <div className="mt-20 pt-10 grid grid-cols-2 gap-20">
                <div className="border-t border-black pt-4">
                  <p className="text-10 font-bold uppercase tracking-widest mb-10 text-gray-400">Disediakan Oleh:</p>
                  <p className="font-bold text-14 uppercase">{formData.urussetiaName}</p>
                  <p className="text-12 text-gray-500 italic">(Tandatangan Digital Sistem)</p>
                </div>
                <div className="border-t border-black pt-4">
                  <p className="text-10 font-bold uppercase tracking-widest mb-10 text-gray-400">Diluluskan Oleh:</p>
                  <div className="h-10"></div>
                  <p className="text-12 text-gray-500">(Tandatangan & Cop Rasmi)</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        {/* --- EDIT CONFIRMATION DIALOG --- */}
        <AlertDialog open={showEditConfirm} onOpenChange={setShowEditConfirm}>
          <AlertDialogContent className="bg-white rounded-lg border border-gray-200 shadow-lg max-w-sm">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-16 font-semibold text-gray-900">
                Kemaskini Rekod?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-14 text-gray-500 pt-1">
                Adakah anda pasti untuk menyimpan perubahan maklumat pada rekod agihan ini?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-4 gap-2">
              <AlertDialogCancel className="border-gray-200 text-gray-500 hover:bg-gray-50 font-medium text-12 px-4 h-9">
                Batal
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => {
                  setShowEditConfirm(false);
                  handleSave();
                }}
                className="bg-blue-600 hover:bg-blue-700 !text-white border-none font-medium text-12 px-4 h-9"
              >
                Ya, Simpan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
      </DialogContent>
    </Dialog>
    
  )
}
