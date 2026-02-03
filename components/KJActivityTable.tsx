'use client'

import React, { useState } from 'react'
import { CheckCircle2, XCircle, User, ArrowRight, FileText, AlertCircle } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export default function KJActivityTable({ kjList, allRecords = [] }: { kjList: any[], allRecords?: any[] }) {  const [selectedKJ, setSelectedKJ] = useState<any>(null);

  // Filter records specifically for the drawer
  const kjApprovals = allRecords.filter(rec => rec.approvals?.includes(selectedKJ?.$id));
  const kjRejections = allRecords.filter(rec => rec.rejections?.includes(selectedKJ?.$id));

  return (
    <div className="w-full">
      <Sheet>
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="py-4 text-12 font-bold uppercase text-gray-400">Ketua Jabatan</TableHead>
              <TableHead className="py-4 text-12 font-bold uppercase text-gray-400 text-center">Lulus</TableHead>
              <TableHead className="py-4 text-12 font-bold uppercase text-gray-400 text-center">KIV</TableHead>
              <TableHead className="py-4 text-12 font-bold uppercase text-gray-400 text-right">Tindakan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {kjList.map((kj) => {
              const approvedCount = allRecords.filter(rec => rec.approvals?.includes(kj.$id)).length;
              const rejectedCount = allRecords.filter(rec => rec.rejections?.includes(kj.$id)).length;

              return (
                <TableRow key={kj.$id} className="group hover:bg-slate-50/50">
                  <TableCell className="py-4 font-bold text-gray-900 uppercase text-13">
                    {kj.firstName} {kj.lastName}
                  </TableCell>
                  <TableCell className="py-4 text-center font-bold text-green-600">{approvedCount}</TableCell>
                  <TableCell className="py-4 text-center font-bold text-red-600">{rejectedCount}</TableCell>
                  <TableCell className="py-4 text-right">
                    <SheetTrigger asChild>
                      <button 
                        onClick={() => setSelectedKJ(kj)}
                        className="p-2 hover:bg-blue-50 rounded-full text-blue-600 transition-all"
                      >
                        <ArrowRight size={18} />
                      </button>
                    </SheetTrigger>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* SIDE DRAWER CONTENT */}
        <SheetContent className="w-full sm:max-w-md border-l border-gray-100 bg-white p-0">
          <div className="h-full flex flex-col">
            <div className="p-6 bg-slate-900 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center font-black text-20">
                  {selectedKJ?.firstName[0]}
                </div>
                <div>
                  <SheetTitle className="text-white uppercase font-black">{selectedKJ?.firstName} {selectedKJ?.lastName}</SheetTitle>
                  <p className="text-12 text-slate-400">{selectedKJ?.email}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* REJECTIONS SECTION (High Priority for KP) */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle size={18} />
                  <h4 className="font-black text-12 uppercase tracking-widest">Senarai KIV / Tolak</h4>
                </div>
                {kjRejections.length > 0 ? (
                  kjRejections.map(rec => (
                    <div key={rec.$id} className="p-4 rounded-xl border border-red-100 bg-red-50/30">
                      <p className="font-bold text-13 text-gray-900 uppercase mb-1">{rec.penerima}</p>
                      <p className="text-11 text-gray-500 line-clamp-1 italic mb-2">{rec.tujuan}</p>
                      <div className="text-10 font-bold text-red-700 bg-white border border-red-100 px-2 py-1 rounded inline-block">
                        RM {Number(rec.jumlah).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-12 text-gray-400 italic">Tiada rekod penolakan.</p>
                )}
              </section>

              {/* APPROVALS SECTION */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 size={18} />
                  <h4 className="font-black text-12 uppercase tracking-widest">Senarai Kelulusan</h4>
                </div>
                {kjApprovals.map(rec => (
                  <div key={rec.$id} className="p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-13 text-gray-900 uppercase">{rec.penerima}</p>
                      <p className="text-11 text-gray-400 uppercase">{rec.kategoriPenerima}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-12 font-black text-blue-900">RM {Number(rec.jumlah).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </section>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}