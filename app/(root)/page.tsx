import HeaderBox from '@/components/HeaderBox'
import RecentContributions from '@/components/RecentContributions'
import AgihanTable from '@/components/AgihanTable'
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { getRecentPenerimaan } from '@/lib/actions/dana.actions';
import { getRecentAgihan } from '@/lib/actions/wang-keluar.actions';
import { getCommitteeMembers } from '@/lib/actions/jawatankuasa';
import Link from 'next/link';
import { ArrowRight, Activity, Users, PlusCircle, Send } from 'lucide-react';
import { redirect } from "next/navigation";

export default async function Home({ searchParams: { page } }: SearchParamProps) {
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) redirect('/sign-in');

  // REDIRECT BASED ON ROLE
  // if (loggedIn.role === 'urussetia') redirect('/urussetia');
  if (loggedIn.role === 'kj') redirect('/bod-dashboard');
  if (loggedIn.role === 'kp') redirect('/admin-dashboard');

  // Fallback for existing admin logic
  const isAdmin = loggedIn?.role === 'admin';

  const [penerimaan, agihan, members] = await Promise.all([
    getRecentPenerimaan(),
    getRecentAgihan(),
    getCommitteeMembers()
  ]);

  const totalIn = penerimaan.reduce((acc: number, curr: any) => acc + curr.jumlah, 0);
  const totalOut = agihan.filter((item: any) => item.status === 'approved').reduce((acc: number, curr: any) => acc + curr.jumlah, 0);
  const totalPending = agihan.filter((item: any) => item.status === 'pending').reduce((acc: number, curr: any) => acc + curr.jumlah, 0);
  const currentBalance = totalIn - totalOut;

  return (
    <section className="flex h-screen w-full flex-col overflow-y-auto bg-gray-25 p-6 md:p-10 no-scrollbar">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8">
        
        {/* HEADER AREA */}
        <header className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <HeaderBox 
              type="greeting"
              title="Pusat Kawalan Utama"
              user={loggedIn?.firstName || 'User'}
              subtext="Ringkasan eksekutif pengurusan dana dan status agihan semasa."
            />
            <div className="hidden lg:flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm">
               <Activity size={16} className="text-blue-600" />
               <span className="text-12 font-bold text-gray-600 uppercase tracking-tight">Sistem Aktif</span>
            </div>
          </div>

          {isAdmin && (
            <div className="flex flex-col gap-4">
              <TotalBalanceBox 
                totalIn={totalIn}
                totalOut={totalOut}
                currentBalance={currentBalance}
              />
              <div className="flex items-center gap-2 bg-orange-50/50 border border-orange-100 rounded-lg px-3 py-2 w-fit">
                 <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                 <p className="text-10 font-bold text-orange-900 uppercase">
                   Komitmen Menunggu Kelulusan: RM {totalPending.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                 </p>
              </div>
            </div>
          )}
        </header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LOG TRANSAKSI - Direct Table Usage */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            
            {/* SECTION 1: PENERIMAAN DANA (Money In) */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <PlusCircle size={20} className="text-green-600" />
                  <h2 className="text-18 font-bold text-gray-900 tracking-tight">Kemasukan Dana Terkini</h2>
                </div>
                <Link href="/penerimaan-dana" className="group flex items-center gap-1 text-12 font-bold text-blue-600">
                  Lihat Semua <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <RecentContributions transactions={penerimaan.slice(0, 5)} />
            </div>

            {/* SECTION 2: AGIHAN DANA (Money Out) */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Send size={20} className="text-blue-600" />
                  <h2 className="text-18 font-bold text-gray-900 tracking-tight">Agihan Dana Terkini</h2>
                </div>
                <Link href="/wang-keluar" className="group flex items-center gap-1 text-12 font-bold text-blue-600">
                  Urus Agihan <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <AgihanTable agihan={agihan.slice(0, 5)} isAdmin={isAdmin} />
            </div>

          </div>

          {/* SIDE INFO - STATS CARDS */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-18 font-bold text-gray-900 tracking-tight px-1">Ringkasan Kerja</h2>
              
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm divide-y divide-gray-50">
                <div className="flex items-center justify-between pb-4">
                  <span className="text-12 font-bold text-gray-500 uppercase tracking-wider">Menunggu Kelulusan</span>
                  <span className="text-20 font-black text-orange-600">{agihan.filter((t: any) => t.status === 'pending').length}</span>
                </div>
                <div className="flex items-center justify-between py-4">
                  <span className="text-12 font-bold text-gray-500 uppercase tracking-wider">Status KIV</span>
                  <span className="text-20 font-black text-purple-600">{agihan.filter((t: any) => t.status === 'kiv').length}</span>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <span className="text-12 font-bold text-gray-500 uppercase tracking-wider">Agihan Selesai</span>
                  <span className="text-20 font-black text-green-600">{agihan.filter((t: any) => t.status === 'approved').length}</span>
                </div>
              </div>
            </div>

            {/* JAWATANKUASA CARD */}
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-100 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Users size={20} />
                </div>
                <span className="text-10 font-bold bg-white/20 px-2 py-1 rounded uppercase">Sesi 2026</span>
              </div>
              <div>
                <h3 className="text-24 font-black leading-none">{members.length}</h3>
                <p className="text-12 font-medium opacity-80 mt-1">Ahli Jawatankuasa Aktif</p>
              </div>
              <Link href="/jawatankuasa">
                <button className="w-full py-2.5 bg-white text-blue-600 rounded-xl text-12 font-bold hover:bg-blue-50 transition-colors shadow-sm">
                  Urus Lantikan
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}