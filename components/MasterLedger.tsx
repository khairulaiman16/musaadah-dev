'use client'

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "./ui/button"
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils'

interface MasterLedgerProps {
  data: any[];
  type: 'masuk' | 'keluar';
  isAdmin: boolean;
}

export default function MasterLedger({ data, type, isAdmin }: MasterLedgerProps) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden border-gray-200">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-bold text-gray-900 py-4">Tarikh</TableHead>
              <TableHead className="font-bold text-gray-900">
                {type === 'masuk' ? 'Penyumbang' : 'Penerima'}
              </TableHead>
              <TableHead className="font-bold text-gray-900">Kategori</TableHead>
              <TableHead className="font-bold text-gray-900">Rujukan / Tujuan</TableHead>
              <TableHead className="font-bold text-right text-gray-900">Jumlah (RM)</TableHead>
              <TableHead className="font-bold text-center text-gray-900">Status</TableHead>
              {isAdmin && <TableHead className="w-[60px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item) => {
                // Determine values based on available field names in the object
                const name = item.namaPenyumbang || item.penerima || item.name;
                const date = item.tarikhMasuk || item.tarikhKeluar || item.date;
                const category = item.kategoriPenyumbang || item.kategoriPenerima || item.category;
                const reference = item.noRujukan || item.tujuan || 'N/A';
                const status = item.status || (type === 'masuk' ? 'success' : 'pending');

                return (
                  <TableRow key={item.$id} className="hover:bg-gray-50/30 transition-colors border-b border-gray-50">
                    <TableCell className="text-12 font-medium text-gray-600">
                      {date ? new Date(date).toLocaleDateString('en-GB') : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-14 text-blue-900 uppercase tracking-tight">
                        {name}
                      </div>
                    </TableCell>
                    <TableCell>
                       <span className="text-11 font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-500 uppercase italic">
                         {category || 'Umum'}
                       </span>
                    </TableCell>
                    <TableCell className="text-12 font-medium text-gray-500 max-w-[200px] truncate">
                      {reference}
                    </TableCell>
                    <TableCell className="text-right font-black text-gray-900">
                      {Number(item.jumlah || item.amount).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={status} />
                    </TableCell>
                    
                    {isAdmin && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full">
                              <MoreHorizontal className="h-4 w-4 text-gray-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white border-gray-200 shadow-xl rounded-xl p-2">
                            <DropdownMenuLabel className="text-10 text-gray-400 uppercase tracking-widest">Urus Rekod</DropdownMenuLabel>
                            <DropdownMenuItem className="gap-2 cursor-pointer text-12 font-bold py-2 px-3 rounded-lg hover:bg-gray-50">
                              <Edit size={14} className="text-blue-600" /> Kemaskini
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer text-12 font-bold py-2 px-3 rounded-lg text-red-600 hover:bg-red-50">
                              <Trash2 size={14} /> Padam
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={isAdmin ? 7 : 6} className="text-center py-24 text-gray-400 italic text-14 bg-gray-25/30">
                  Tiada rekod ditemui untuk kategori {type === 'masuk' ? 'Penerimaan' : 'Agihan'} ini.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const isSuccess = s === 'success' || s === 'approved' || s === 'berjaya';
  const isPending = s === 'pending' || s === 'processing';
  const isRejected = s === 'rejected' || s === 'tolak';

  return (
    <span className={cn(
        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
        isSuccess ? "bg-green-100 text-green-700" :
        isPending ? "bg-orange-100 text-orange-700" :
        isRejected ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
    )}>
      {isSuccess ? 'LULUS' : isRejected ? 'TOLAK' : s.toUpperCase()}
    </span>
  )
}