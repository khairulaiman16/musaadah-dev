"use client"

import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table" // Using the exact project UI components
import { Button } from "./ui/button"
import { Check, X, Save, CalendarDays } from "lucide-react"
import { Input } from "./ui/input"
import { useToast } from "@/hooks/use-toast"

export default function AttendanceTracker({ members }: { members: any[] }) {
  const { toast } = useToast()
  const [meetingInfo, setMeetingInfo] = useState({
    bil: "1/2026",
    tarikh: new Date().toISOString().split('T')[0],
  })
  
  const [attendance, setAttendance] = useState<Record<string, boolean>>({})

  const toggleAttendance = (id: string, status: boolean) => {
    setAttendance(prev => ({ ...prev, [id]: status }))
  }

  const handleSave = async () => {
    toast({
      title: "Rekod Berjaya",
      description: `Kehadiran Mesyuarat Bil ${meetingInfo.bil} telah disimpan.`,
    })
  }

  return (
    <div className="flex flex-col gap-4 bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h3 className="text-18 font-bold text-gray-900">Perekodan Kehadiran</h3>
          <p className="text-12 text-gray-500 font-medium">Sila tandakan kehadiran ahli jawatankuasa bagi mesyuarat ini.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border">
            <span className="text-11 font-bold text-gray-500 uppercase">Bil:</span>
            <input 
              value={meetingInfo.bil} 
              onChange={(e) => setMeetingInfo({...meetingInfo, bil: e.target.value})}
              className="bg-transparent border-none text-12 font-bold w-16 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border">
            <CalendarDays size={14} className="text-gray-400" />
            <input 
              type="date" 
              value={meetingInfo.tarikh} 
              onChange={(e) => setMeetingInfo({...meetingInfo, tarikh: e.target.value})}
              className="bg-transparent border-none text-12 focus:outline-none"
            />
          </div>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-9 shadow-sm">
            <Save size={16} /> Simpan
          </Button>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
        <Table className="w-full border-collapse">
          <TableHeader className="bg-gray-50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-gray-900">Nama Ahli</TableHead>
              <TableHead className="font-semibold text-gray-900">Agensi & Jawatan</TableHead>
              <TableHead className="font-semibold text-center w-[220px]">Status Kehadiran</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length > 0 ? (
              members.map((member) => (
                <TableRow key={member.$id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <span className="font-bold text-14 text-gray-900 uppercase tracking-tight">
                      {member.nama}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-12 text-blue-700 font-bold">{member.agensi}</span>
                      <span className="text-11 text-gray-500 italic">{member.jawatan}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => toggleAttendance(member.$id, true)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-11 font-bold transition-all ${
                          attendance[member.$id] === true 
                          ? "bg-green-100 text-green-700 border border-green-200" 
                          : "bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <Check size={14} /> HADIR
                      </button>
                      <button
                        onClick={() => toggleAttendance(member.$id, false)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-11 font-bold transition-all ${
                          attendance[member.$id] === false 
                          ? "bg-red-100 text-red-700 border border-red-200" 
                          : "bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <X size={14} /> TIDAK HADIR
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10 text-gray-400 italic text-14">
                  Tiada profil ahli jawatankuasa dijumpai.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}