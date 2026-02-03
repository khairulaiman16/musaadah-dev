 import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import RecentContributions from '@/components/RecentContributions'
import AgihanTable from '@/components/AgihanTable'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { getRecentPenerimaan } from '@/lib/actions/dana.actions'
import { getRecentAgihan } from '@/lib/actions/wang-keluar.actions'
import { getCommitteeMembers } from '@/lib/actions/jawatankuasa'
import { Activity, Users, ShieldCheck } from 'lucide-react'

export default async function AdminDashboard() {
  const loggedIn = await getLoggedInUser();
  
  // Fetch all system data for the KP
  const [penerimaan, agihan, members] = await Promise.all([
    getRecentPenerimaan(),
    getRecentAgihan(),
    getCommitteeMembers()
  ]);

  // Financial Calculations
  const totalIn = penerimaan.reduce((acc: number, curr: any) => acc + curr.jumlah, 0);
  const totalOut = agihan.filter((item: any) => item.status === 'approved').reduce((acc: number, curr: any) => acc + curr.jumlah, 0);
  const currentBalance = totalIn - totalOut;

  return (
    <section className="flex h-screen w-full flex-col overflow-y-auto bg-gray-25 p-6 md:p-10 no-scrollbar">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8">
        
        <header className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <HeaderBox 
              type="greeting"
              title="Panel Eksekutif Ketua Pengarah"
              user={loggedIn?.firstName || 'User'}
              subtext="Paparan menyeluruh prestasi kewangan dan status agihan Musa'adah."
            />
            <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl flex items-center gap-2">
              <ShieldCheck size={18} className="text-blue-600" />
              <span className="text-12 font-bold text-blue-700 uppercase tracking-tighter">Kawalan Penuh</span>
            </div>
          </div>

          <TotalBalanceBox 
            totalIn={totalIn}
            totalOut={totalOut}
            currentBalance={currentBalance}
          />
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column: Tables */}
          <div className="xl:col-span-2 flex flex-col gap-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-18 font-bold text-gray-900 mb-4">Agihan Terkini (Semua Status)</h2>
              <AgihanTable agihan={agihan.slice(0, 10)} isAdmin={true} />
            </div>
          </div>

          {/* Right Column: Analytics & Quick Info */}
          <div className="flex flex-col gap-6">
            {/* System Pulse */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
               <h3 className="text-14 font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                 <Activity size={16} /> Status Sistem
               </h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-14 text-gray-600">Ahli Jawatankuasa</span>
                    <span className="text-16 font-bold text-blue-600">{members.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-14 text-gray-600">Permohonan KIV</span>
                    <span className="text-16 font-bold text-purple-600">
                      {agihan.filter((t: any) => t.status === 'kiv').length}
                    </span>
                  </div>
               </div>
            </div>

            {/* Quick Link to Committee */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
               <Users size={32} className="mb-4 opacity-50" />
               <h3 className="text-20 font-bold mb-1">Pengurusan Lantikan</h3>
               <p className="text-12 opacity-80 mb-4">Urus ahli jawatankuasa dan peranan mereka dalam sistem.</p>
               <button className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-12 font-bold transition-all">
                 Buka Direktori
               </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}