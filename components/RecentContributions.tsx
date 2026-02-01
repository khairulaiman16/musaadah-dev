'use client'

import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

export default function RecentContributions({ transactions }: { transactions: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // 1. FILTER LOGIC
  const filteredData = transactions.filter((t) => 
    t.namaPenyumbang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.noRujukan?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 2. PAGINATION LOGIC
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  return (
    <div className="flex flex-col gap-4 bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-18 font-bold text-gray-900">Rekod Transaksi Terperinci</h3>
          <p className="text-12 text-gray-500">Semua maklumat pendaftaran dana terkini.</p>
        </div>
        
        {/* MODERN FILTER */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input 
            placeholder="Cari Nama atau No. Rujukan..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1) // Reset to page 1 on search
            }}
          />
        </div>
      </div>

      {/* HORIZONTAL SCROLL FOR MANY COLUMNS - Adjusted min-width and max-width */}
      <div className="w-full max-w-full overflow-x-auto rounded-lg border border-gray-200">
        <Table className="min-w-[800px] w-full border-collapse">
          <TableHeader className="bg-gray-50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold w-[200px]">Penyumbang</TableHead>
              <TableHead className="font-semibold">Jenis Dana</TableHead>
              <TableHead className="font-semibold">Kategori</TableHead>
              <TableHead className="font-semibold">Kaedah</TableHead>
              <TableHead className="font-semibold">Bank</TableHead>
              <TableHead className="font-semibold">No. Rujukan</TableHead>
              <TableHead className="font-semibold text-right">Jumlah (RM)</TableHead>
              <TableHead className="font-semibold text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((t) => (
                <TableRow key={t.$id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-14 text-gray-900">{t.namaPenyumbang}</span>
                      {/* Fixed: Clean date formatting to prevent UI stretch */}
                      <span className="text-11 text-gray-400 font-medium italic uppercase tracking-tighter">
                        {new Date(t.tarikhMasuk).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-14">{t.jenisDana}</TableCell>
                  <TableCell className="text-14 italic text-gray-600">{t.kategoriPenyumbang}</TableCell>
                  <TableCell className="text-14">{t.kaedahBayaran}</TableCell>
                  <TableCell className="text-14">{t.bank || '-'}</TableCell>
                  <TableCell className="text-12 font-mono text-gray-500">{t.noRujukan || '-'}</TableCell>
                  <TableCell className="text-right font-bold text-blue-700">
                    {Number(t.jumlah).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase">
                      Berjaya
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                  Tiada rekod dijumpai.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION FOOTER */}
      <div className="flex items-center justify-between mt-2">
        <p className="text-12 text-gray-500 italic">
          Menunjukkan {indexOfFirstItem + 1} hingga {Math.min(indexOfLastItem, filteredData.length)} daripada {filteredData.length} rekod
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </Button>
          <div className="flex items-center px-4 text-14 font-medium">
            Halaman {currentPage} dari {totalPages || 1}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}