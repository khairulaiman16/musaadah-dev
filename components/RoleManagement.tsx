"use client"

import { useState } from "react"
import { updateUserRole } from "@/lib/actions/user.actions"
import { Button } from "./ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

export default function RoleManagement({ users }: { users: any[] }) {
  const [userList, setUserList] = useState(users);

  const handleRoleChange = async (documentId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    const result = await updateUserRole({ documentId, role: newRole });

    if (result) {
      setUserList((prev) => 
        prev.map((u) => u.$id === documentId ? { ...u, role: newRole } : u)
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white p-4 md:p-6 rounded-xl border shadow-sm">
      <h3 className="text-18 font-bold text-gray-900">Urus Kebenaran Akses (Roles)</h3>
      
      {/* DESKTOP VIEW: Standard Table (Hidden on Mobile) */}
      <div className="hidden md:block">
        <Table>
          <TableHeader className="bg-faint-blue">
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700">Nama</TableHead>
              <TableHead className="font-semibold text-gray-700">Email</TableHead>
              <TableHead className="font-semibold text-gray-700">Peranan</TableHead>
              <TableHead className="text-right font-semibold text-gray-700">Tindakan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userList.map((user) => (
              <TableRow key={user.$id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium text-14 text-gray-900">{user.firstName} {user.lastName}</TableCell>
                <TableCell className="text-14 text-gray-600">{user.email}</TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    user.role === 'admin' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role || 'MEMBER'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    onClick={() => handleRoleChange(user.$id, user.role)}
                    variant="outline"
                    className="text-xs border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                  >
                    Tukar ke {user.role === 'admin' ? 'Member' : 'Admin'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MOBILE VIEW: Card List (Hidden on Desktop) */}
      <div className="flex flex-col gap-4 md:hidden">
        {userList.map((user) => (
          <div key={user.$id} className="flex flex-col gap-3 p-4 rounded-lg border border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <p className="text-14 font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                <p className="text-12 text-gray-500">{user.email}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                user.role === 'admin' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {user.role || 'MEMBER'}
              </span>
            </div>
            
            <Button 
              onClick={() => handleRoleChange(user.$id, user.role)}
              className="w-full text-xs bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-2 h-9"
            >
              Set sebagai {user.role === 'admin' ? 'Member' : 'Admin'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}