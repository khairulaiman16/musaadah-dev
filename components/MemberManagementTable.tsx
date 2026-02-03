'use client'

import React, { useState } from 'react'
import { UserPlus, Loader2, Mail, Calendar, ShieldAlert } from 'lucide-react'
import { Button } from "./ui/button"
import { useToast } from "@/hooks/use-toast"
import { promoteMemberToKJ } from "@/lib/actions/user.actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data - you will pass real members from the parent page later
const mockMembers = [
  { $id: '1', firstName: 'Azman', lastName: 'Ali', email: 'azman@gmail.com', dwollaCustomerUrl: '2024-01-15', role: 'member' },
  { $id: '2', firstName: 'Farah', lastName: 'Wahida', email: 'farah@gmail.com', dwollaCustomerUrl: '2024-02-01', role: 'member' },
];

export default function MemberManagementTable({ members = mockMembers }: { members?: any[] }) {
  const { toast } = useToast();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handlePromote = async (userId: string, name: string) => {
    setLoadingId(userId);
    try {
      const res = await promoteMemberToKJ(userId);
      if (res?.success) {
        toast({
          title: "PERANAN DIKEMASKINI",
          description: `${name} kini telah dilantik sebagai Ketua Jabatan (BOD).`,
        });
      } else {
        throw new Error();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "RALAT",
        description: "Gagal memproses permohonan promosi.",
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="py-4 text-12 font-bold uppercase text-gray-400">Nama Ahli</TableHead>
            <TableHead className="py-4 text-12 font-bold uppercase text-gray-400">E-mel</TableHead>
            <TableHead className="py-4 text-12 font-bold uppercase text-gray-400">Tarikh Daftar</TableHead>
            <TableHead className="py-4 text-12 font-bold uppercase text-gray-400 text-right">Tindakan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length > 0 ? (
            members.map((member) => (
              <TableRow key={member.$id} className="group transition-colors hover:bg-slate-50/50">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-14">
                      {member.firstName[0]}{member.lastName[0]}
                    </div>
                    <span className="font-bold text-gray-900 uppercase text-13">
                      {member.firstName} {member.lastName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-gray-500 font-medium text-13 italic">
                  {member.email}
                </TableCell>
                <TableCell className="py-4 text-gray-500 text-13">
                  {new Date().toLocaleDateString('en-GB')}
                </TableCell>
                <TableCell className="py-4 text-right">
                  <Button
                    onClick={() => handlePromote(member.$id, `${member.firstName} ${member.lastName}`)}
                    disabled={loadingId === member.$id}
                    className="bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-11 h-9 px-4 rounded-lg transition-all uppercase tracking-tight"
                  >
                    {loadingId === member.$id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <><UserPlus className="mr-2 size-3" /> Promosi KJ</>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center text-gray-400 italic">
                Tiada ahli biasa ditemui untuk promosi.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}