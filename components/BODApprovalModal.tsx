'use client'

import React, { useState } from 'react'
import { X, CheckCircle, Clock, FileText, AlertCircle, Loader2, Calendar, Tag, CreditCard, User, ThumbsDown } from 'lucide-react'
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { approveAgihanByBOD, rejectAgihanByBOD } from "@/lib/actions/wang-keluar.actions"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
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

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  userId: string;
  onApproveSuccess?: (newApprovals: string[]) => void;
  onRejectSuccess?: (newStatus: string) => void;
}

export default function BODApprovalModal({ isOpen, onClose, item, userId, onApproveSuccess, onRejectSuccess }: ModalProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isRejectMode, setIsRejectMode] = useState(false);
  const [reason, setReason] = useState("");
  
  // Track approvals locally so UI updates instantly
  const [localApprovals, setLocalApprovals] = useState<string[]>(item.approvals || []);
  const approvedCount = localApprovals.length;
  const rejectedCount = item.rejections?.length || 0;
  const totalVotedCount = approvedCount + rejectedCount;

  const hasApproved = localApprovals.includes(userId);
  const hasRejected = item.rejections?.includes(userId);
  const hasVoted = hasApproved || hasRejected;

  if (!isOpen || !item) return null;

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await approveAgihanByBOD(item.$id, userId);
      
      if (res && res.success !== false) {
        const updatedList = [...localApprovals, userId];
        setLocalApprovals(updatedList);
        
        // Trigger the callback to update the parent Card instantly
        if (onApproveSuccess) onApproveSuccess(updatedList);

        toast({
          title: "KELULUSAN DIREKOD",
          description: "Persetujuan anda telah berjaya disimpan.",
        });

        // Refresh data and close modal immediately to match rejection behavior
        router.refresh();
        onClose();
      } else if (res?.success === false) {
        toast({
          variant: "destructive",
          title: "PERHATIAN",
          description: res.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "RALAT",
        description: "Gagal merekodkan kelulusan.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reason || reason.trim().length < 5) {
      return toast({
        variant: "destructive",
        title: "ALASAN DIPERLUKAN",
        description: "Sila berikan ulasan ringkas mengapa anda menolak permohonan ini.",
      });
    }

    setLoading(true);
    try {
      const res = await rejectAgihanByBOD(item.$id, userId, reason);
      
      if (res && res.success !== false) {
        if (onRejectSuccess) onRejectSuccess('kiv');
        toast({
          title: "PERMOHONAN DI-KIV",
          description: "Ulasan penolakan anda telah direkodkan and status dikemaskini ke KIV.",
        });
        
        router.refresh(); 
        onClose();
      } else {
        toast({
          variant: "destructive",
          title: "RALAT",
          description: res?.message || "Gagal memproses penolakan.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "RALAT SISTEM",
        description: "Berlaku ralat semasa menghubungi pelayan.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 md:p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setIsRejectMode(false); setReason(""); onClose(); }} />
        
        <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh] md:max-h-[90vh] border border-gray-200 z-[115]">
          
          <button 
            onClick={() => { setIsRejectMode(false); setReason(""); onClose(); }}
            className="absolute right-4 top-4 z-[120] text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          {/* LEFT SIDE: DOCUMENT DETAILS */}
          <div className="flex-1 overflow-y-auto bg-white border-b md:border-b-0 md:border-r border-gray-100">
            <div className="bg-slate-50 px-6 py-6 md:px-8 border-b border-gray-100">
              <div className="flex justify-between items-start mb-4 pr-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Semakan Kelulusan Dana</p>
                  <h2 className="text-20 md:text-28 font-black text-gray-900 leading-tight uppercase">
                    {item.penerima}
                  </h2>
                </div>
                <span className={cn(
                  "hidden sm:inline-block px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider shadow-sm shrink-0",
                  item.status === 'kiv' ? "bg-orange-500" : "bg-blue-500"
                )}>
                  {item.status === 'kiv' ? 'STATUS: KIV' : 'MENUNGGU KELULUSAN'}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-4">
                 <div className="flex items-center gap-1.5 text-12 text-gray-500 font-medium">
                    <Calendar size={14} />
                    {new Date(item.$createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                 </div>
                 <div className="flex items-center gap-1.5 text-12 text-gray-500 font-mono italic">
                    #{item.$id.slice(-8).toUpperCase()}
                 </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {isRejectMode ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700">
                    <AlertCircle size={20} />
                    <p className="text-14 font-bold uppercase">Mod Penolakan (KIV)</p>
                  </div>
                  <p className="text-13 text-gray-500 font-medium">Sila nyatakan ulasan ringkas mengapa permohonan ini perlu disemak semula (KIV):</p>
                  <Textarea 
                    placeholder="Contoh: Dokumen sokongan tidak lengkap / Perlu pengesahan tambahan dari pihak teknikal..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="min-h-[150px] border-gray-200 focus:ring-red-500 focus:border-red-500 rounded-xl"
                  />
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={handleReject}
                      disabled={loading}
                      className="flex-1 h-12 bg-red-600 hover:bg-red-700 !text-white font-bold uppercase rounded-xl"
                    >
                      {loading ? <Loader2 className="animate-spin mr-2" /> : <ThumbsDown size={18} className="mr-2" />}
                      Sahkan Penolakan
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => { setIsRejectMode(false); setReason(""); }}
                      disabled={loading}
                      className="h-12 px-6 border-gray-200 text-gray-500 font-bold uppercase rounded-xl"
                    >
                      Batal
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Tujuan / Program</span>
                      <p className="text-14 md:text-15 font-semibold text-gray-700 leading-relaxed uppercase">{item.tujuan}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Jumlah Agihan</span>
                      <p className="text-20 md:text-24 font-black text-blue-900">RM {Number(item.jumlah).toLocaleString('en-MY', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Kategori & Kaedah</span>
                      <div className="flex flex-col gap-1">
                        <p className="text-13 text-gray-600 flex items-center gap-2 font-medium">
                          <Tag size={12} className="text-blue-500" /> {item.kategoriPenerima}
                        </p>
                        <p className="text-13 text-gray-600 flex items-center gap-2 font-medium">
                          <CreditCard size={12} className="text-blue-500" /> {item.kaedahBayaran}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Disediakan Oleh</span>
                      <div className="flex items-center gap-2">
                         <div className="bg-blue-100 p-1 rounded text-blue-600"><User size={12}/></div>
                         <p className="text-14 font-bold text-gray-700 uppercase">{item.urussetiaName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Nota / Remark</p>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <p className="text-13 text-gray-600 italic leading-snug">
                        {item.remark || 'Tiada nota tambahan disediakan.'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 pb-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-3">Dokumen Sokongan</p>
                    {item.attachmentId ? (
                      <div 
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/30 cursor-pointer"
                        onClick={() => window.open(`https://cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID}/files/${item.attachmentId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`, '_blank')}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileText className="text-blue-500 shrink-0" size={24} />
                          <span className="text-13 font-bold text-gray-900 truncate">LAMPIRAN_DOKUMEN.pdf</span>
                        </div>
                        <span className="text-blue-600 font-black text-11 tracking-widest ml-2 shrink-0 uppercase">Lihat</span>
                      </div>
                    ) : (
                      <p className="text-12 text-gray-400 italic">Tiada dokumen dilampirkan.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: APPROVAL PANEL */}
          <div className="w-full md:w-[380px] bg-slate-50 p-6 md:p-8 flex flex-col justify-between border-l border-gray-100">
            <div className="space-y-6 md:space-y-8">
              <div className="hidden md:block text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-6 tracking-widest">Progress KELULUSAN</p>
                <div className="relative inline-flex items-center justify-center">
<svg className="w-40 h-40 transform -rotate-90">
  {/* Background Track */}
  <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-gray-200" />
  
  {/* Single Blue Progress Track (Counts both Lulus & Tolak) */}
  <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="10" fill="transparent" 
    strokeDasharray={464.7}
    strokeDashoffset={464.7 - (464.7 * (totalVotedCount / 10))}
    className="text-blue-600 transition-all duration-1000 ease-out" 
    strokeLinecap="round"
  />
</svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-32 font-black text-gray-900 leading-none">{totalVotedCount}</span>
                    <span className="text-12 font-bold text-gray-400 uppercase tracking-tighter">daripada 10</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-tight">Korum Pengarah</p>
                   <p className="text-11 font-bold text-blue-600">{totalVotedCount}/10 ({Math.round((totalVotedCount/10)*100)}%)</p>
                 </div>
                 <div className="grid grid-cols-10 gap-1 md:gap-1.5">
                   {[...Array(10)].map((_, i) => {
                     let colorClass = "bg-gray-200";
                     if (i < approvedCount) {
                       colorClass = "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]";
                     } else if (i < totalVotedCount) {
                       colorClass = "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]";
                     }
                     
                     return (
                       <div key={i} className={cn(
                         "h-2 md:h-2.5 rounded-full transition-all duration-500",
                         colorClass
                       )} />
                     )
                   })}
                 </div>
                 <p className="text-11 text-gray-400 italic leading-tight text-center px-4">
                   Memerlukan konsensus daripada 10 ahli BOD untuk kelulusan automatik.
                 </p>
              </div>
            </div>

            <div className="space-y-3 pt-6 md:pt-0 border-t md:border-t-0 border-gray-100 mt-6 md:mt-0">
              <Button 
                onClick={() => setShowConfirm(true)}
                disabled={loading || hasVoted || isRejectMode}
                className={cn(
                  "w-full h-14 md:h-16 rounded-xl shadow-lg flex items-center justify-center gap-3 text-16 md:text-18 font-black uppercase tracking-tight transition-all",
                  hasVoted 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
                    : "bg-blue-600 hover:bg-blue-700 !text-white"
                )}
              >
                {loading ? <Loader2 className="animate-spin" /> : <CheckCircle size={22} />}
                {hasVoted ? "Tindakan Telah Diambil" : "Luluskan Rekod"}
              </Button>
              
              {!hasVoted && !isRejectMode && (
                <Button 
                  variant="ghost" 
                  onClick={() => setIsRejectMode(true)}
                  className="w-full h-12 text-red-500 font-bold hover:bg-red-50 transition-all uppercase text-11 tracking-widest"
                >
                  Tolak Permohonan (KIV)
                </Button>
              )}

              <Button 
                variant="ghost" 
                onClick={() => { setIsRejectMode(false); setReason(""); onClose(); }}
                className="w-full h-10 text-gray-400 font-bold hover:text-gray-600 transition-all uppercase text-11 tracking-widest"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- DOUBLE CONFIRMATION DIALOG --- */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="z-[200] bg-white rounded-lg border border-gray-200 shadow-lg max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-16 font-semibold text-gray-900">
              Sahkan Kelulusan?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-14 text-gray-500 pt-1">
              Adakah anda pasti untuk memberikan kelulusan bagi agihan dana ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4 gap-2">
            <AlertDialogCancel className="border-gray-200 text-gray-500 hover:bg-gray-50 font-medium text-12 px-4 h-9">
              Kembali
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault(); // Stop automatic closing
                setShowConfirm(false);
                handleApprove();
              }}
              className="bg-blue-600 hover:bg-blue-700 !text-white border-none font-medium text-12 px-4 h-9"
            >
              Sahkan & Lulus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}