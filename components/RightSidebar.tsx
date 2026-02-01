import React from 'react'
import Link from 'next/link'
import { CalendarDays, FileText, CheckCircle2, UserCircle, LogOut } from 'lucide-react'

const RightSidebar = ({ user, transactions, members }: RightSidebarProps) => {
  // Filter for members whose appointments are expiring soon (e.g., within 3 months)
  const upcomingExpirations = members?.slice(0, 2); 

  return (
    <aside className="right-sidebar custom-scrollbar">
      {/* 1. OFFICER PROFILE CARD */}
      <section className="flex flex-col pb-8">
        <div className="h-24 w-full bg-gradient-to-r from-blue-600 to-blue-400" />
        <div className="profile">
          <div className="profile-img bg-white border-4 border-white shadow-md">
            <span className="text-5xl font-bold text-blue-600">{user?.firstName[0]}</span>
          </div>

          <div className="profile-details">
            <h1 className='profile-name text-gray-900'>
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="profile-email text-gray-500">
              {user?.email}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded border border-blue-100">
                {user?.role || 'Pegawai Pentadbir'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CAPAIAN PANTAS (Quick Actions) */}
      <section className="px-6 pb-8">
        <h2 className="text-12 font-bold text-gray-400 uppercase tracking-widest mb-4">Capaian Pantas</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/statistik-laporan" className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-500 hover:shadow-sm transition-all group">
            <FileText size={20} className="text-gray-400 group-hover:text-blue-600" />
            <span className="text-10 font-bold text-gray-500 mt-2 uppercase tracking-tight">Laporan</span>
          </Link>
          <Link href="/wang-keluar/senarai-agihan" className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-500 hover:shadow-sm transition-all group">
            <CheckCircle2 size={20} className="text-gray-400 group-hover:text-blue-600" />
            <span className="text-10 font-bold text-gray-500 mt-2 uppercase tracking-tight">Kelulusan</span>
          </Link>
        </div>
      </section>

      {/* 3. AKTIVITI PENTING (Officer Deadlines) */}
      <section className="px-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-12 font-bold text-gray-400 uppercase tracking-widest">Aktiviti Penting</h2>
          <CalendarDays size={16} className="text-gray-300" />
        </div>

        <div className="space-y-3">
          {upcomingExpirations && upcomingExpirations.length > 0 ? (
            upcomingExpirations.map((member) => (
              <div key={member.$id} className="p-3 bg-gray-50 border-l-4 border-blue-500 rounded-r-lg">
                <p className="text-12 font-bold text-gray-800">Tamat Lantikan: {member.nama}</p>
                <p className="text-11 text-gray-500 mt-1">
                  {new Date(member.tarikhTamat).toLocaleDateString('en-GB')} • {member.agensi}
                </p>
              </div>
            ))
          ) : (
            <p className="text-12 text-gray-400 italic">Tiada aktiviti dikesan.</p>
          )}

          {/* Static Meeting Reminder */}
          <div className="p-3 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
            <p className="text-12 font-bold text-orange-900">Mesyuarat Jawatankuasa</p>
            <p className="text-11 text-orange-700 mt-1 underline">Sila kemaskini kehadiran ahli.</p>
          </div>
        </div>
      </section>

      {/* 4. FOOTER SETTINGS */}
      <div className="mt-auto p-6 border-t border-gray-100">
        <button className="flex items-center gap-3 text-gray-400 hover:text-red-500 transition-all">
          <LogOut size={18} />
          <span className="text-14 font-medium">Log Keluar</span>
        </button>
      </div>
    </aside>
  )
}

export default RightSidebar