import React from 'react'
import { Users, ShieldCheck, Activity } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HeaderBox from '@/components/HeaderBox' 
import { cn } from "@/lib/utils"
import { getAllUsers } from '@/lib/actions/user.actions'

import KJActivityTable from '@/components/KJActivityTable'
import MemberManagementTable from '@/components/MemberManagementTable'

export default async function AhliJawatankuasaPage() {
  const allUsers = await getAllUsers();
  
  // Filter users by role
  const kjUsers = allUsers.filter((user: any) => user.role === 'kj');
  const membersOnly = allUsers.filter((user: any) => user.role === 'member');

  const stats = [
    { label: 'Total KJ (BOD)', value: kjUsers.length.toString(), icon: ShieldCheck, iconColor: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Ahli Terdaftar', value: membersOnly.length.toString(), icon: Users, iconColor: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Aktiviti Keseluruhan', value: allUsers.length.toString(), icon: Activity, iconColor: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <section className="flex flex-col gap-8 p-6 md:p-10 bg-slate-50 min-h-screen">
      <HeaderBox 
        title="Pengurusan Ahli Jawatankuasa"
        subtext="Pantau prestasi kelulusan Ketua Jabatan dan urus peranan ahli organisasi."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className={cn("p-4 rounded-xl", stat.bg)}>
              <stat.icon className={cn("size-6", stat.iconColor)} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-24 font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="kj-list" className="w-full">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-xl mb-8 w-full md:w-auto">
          <TabsTrigger 
            value="kj-list" 
            className="rounded-lg px-8 py-2.5 font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all uppercase text-12"
          >
            Prestasi Ketua Jabatan
          </TabsTrigger>
          <TabsTrigger 
            value="members" 
            className="rounded-lg px-8 py-2.5 font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all uppercase text-12"
          >
            Senarai Ahli & Promosi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kj-list" className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-slate-50/50">
              <h3 className="font-bold text-gray-900 uppercase text-14">Rekod Kelulusan BOD</h3>
            </div>
            {/* Pass the KJ users to this table */}
            <KJActivityTable kjList={kjUsers} />
          </div>
        </TabsContent>

        <TabsContent value="members" className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-gray-50 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 uppercase text-14">Pengurusan Peranan Ahli</h3>
              <span className="hidden md:inline-block text-[10px] font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full italic">
                Nota: Hanya KP boleh menukar peranan ahli kepada KJ
              </span>
            </div>
            {/* Pass the Member users to this table */}
            <MemberManagementTable members={membersOnly} />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}