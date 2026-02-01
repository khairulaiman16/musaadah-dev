"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  MoreVertical,
  Filter // Added for the filter icon
} from "lucide-react"
import { updateAgihanStatus } from "@/lib/actions/wang-keluar.actions"
import { useToast } from "@/hooks/use-toast"

export default function AgihanTable({ agihan, isAdmin }: { agihan: any[], isAdmin: boolean }) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all") // Default to "all"
  const [currentPage, setCurrentPage] = useState(1)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const itemsPerPage = 10

  // Updated filtering logic to handle both search and status
  const filteredData = agihan.filter((item) => {
    const matchesSearch = item.penerima.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tujuan.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleStatusUpdate = async (id: string, newStatus: any) => {
    setIsUpdating(id)
    try {
      const result = await updateAgihanStatus(id, newStatus);
      if (result) {
        toast({
          title: "KEMASKINI BERJAYA",
          description: `Rekod telah ditukar kepada ${newStatus.toUpperCase()}.`,
          className: "bg-white border-l-4 border-blue-500 shadow-md",
        })
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Ralat", description: "Gagal mengemaskini status." })
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <div className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h3 className="text-18 font-bold text-gray-900">Rekod Agihan Terperinci</h3>
          <p className="text-12 text-gray-500">Urus kelulusan dan semak status agihan dana.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
          {/* Status Filter - Modern Select */}
          <div className="relative">
             <Select onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }} defaultValue="all">
                <SelectTrigger className="w-[140px] h-10 border-gray-200 bg-gray-50/50 text-12 font-medium">
                  <div className="flex items-center gap-2">
                    <Filter size={14} className="text-gray-400" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-md">
                  <SelectItem value="all" className="text-12 font-medium">Semua Status</SelectItem>
                  <SelectItem value="pending" className="text-12 font-medium text-orange-600">Pending</SelectItem>
                  <SelectItem value="approved" className="text-12 font-medium text-green-600">Lulus</SelectItem>
                  <SelectItem value="rejected" className="text-12 font-medium text-red-600">Ditolak</SelectItem>
                  <SelectItem value="kiv" className="text-12 font-medium text-purple-600">KIV</SelectItem>
                  <SelectItem value="tangguh" className="text-12 font-medium text-amber-600">Tangguh</SelectItem>
                </SelectContent>
             </Select>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Cari Penerima atau Tujuan..." 
              className="pl-10 h-10 border-gray-200 bg-gray-50/50"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-lg border border-gray-100">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-bold text-gray-900 py-4 text-13">Penerima</TableHead>
              <TableHead className="font-bold text-gray-900 text-13">Tujuan</TableHead>
              <TableHead className="font-bold text-gray-900 text-13">Kategori</TableHead>
              <TableHead className="font-bold text-gray-900 text-right text-13">Jumlah (RM)</TableHead>
              <TableHead className="font-bold text-gray-900 text-center text-13">Status</TableHead>
              {isAdmin && <TableHead className="font-bold text-gray-900 text-center text-13">Tindakan</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <TableRow key={item.$id} className="hover:bg-gray-50/30 transition-colors border-b border-gray-50">
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-14 text-gray-900">{item.penerima}</span>
                      <span className="text-11 text-gray-400 uppercase tracking-tighter">
                        {new Date(item.tarikhKeluar).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-14 text-gray-600 font-medium">{item.tujuan}</TableCell>
                  <TableCell className="text-14 italic text-gray-500">{item.kategoriPenerima}</TableCell>
                  <TableCell className="text-right font-bold text-blue-900">
                    {Number(item.jumlah).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      item.status === 'approved' ? "bg-green-100 text-green-700" :
                      item.status === 'rejected' ? "bg-red-100 text-red-700" :
                      item.status === 'kiv' ? "bg-purple-100 text-purple-700" :
                      item.status === 'tangguh' ? "bg-amber-100 text-amber-700" :
                      "bg-orange-100 text-orange-700"
                    )}>
                      {item.status === 'approved' ? 'LULUS' : item.status === 'rejected' ? 'TOLAK' : item.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Select
                          disabled={isUpdating === item.$id}
                          onValueChange={(value) => handleStatusUpdate(item.$id, value as any)}
                        >
                          <SelectTrigger className="h-8 w-[100px] text-[10px] font-bold border-gray-200 bg-gray-50/50 hover:bg-gray-100 transition-all">
                            <div className="flex items-center gap-1">
                              {isUpdating === item.$id ? <Loader2 size={12} className="animate-spin" /> : <MoreVertical size={12} />}
                              <SelectValue placeholder={['approved', 'rejected'].includes(item.status) ? "SET" : "SET"} />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-200 shadow-md">
                            <SelectItem value="pending" className="text-gray-500 font-bold text-[10px]">PENDING</SelectItem>
                            <SelectItem value="approved" className="text-blue-600 font-bold text-[10px]">LULUS</SelectItem>
                            <SelectItem value="rejected" className="text-red-600 font-bold text-[10px]">TOLAK</SelectItem>
                            <SelectItem value="kiv" className="text-purple-600 font-bold text-[10px]">KIV</SelectItem>
                            <SelectItem value="tangguh" className="text-amber-600 font-bold text-[10px]">TANGGUH</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isAdmin ? 6 : 5} className="h-32 text-center text-gray-400 text-14">
                   Tiada rekod {statusFilter !== "all" ? `berstatus ${statusFilter.toUpperCase()}` : ""} dijumpai.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <p className="text-12 text-gray-500 italic">
             Menunjukkan {indexOfFirstItem + 1} hingga {Math.min(indexOfLastItem, filteredData.length)} daripada {filteredData.length} rekod
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 border-gray-200 text-gray-600"
            >
              <ChevronLeft size={14} className="mr-1" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 border-gray-200 text-gray-600"
            >
              Next <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}