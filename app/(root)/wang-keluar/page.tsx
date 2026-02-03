import HeaderBox from '@/components/HeaderBox'
import AgihanTable from '@/components/AgihanTable'
import AnimatedCounter from '@/components/AnimatedCounter'
import { getRecentAgihan } from '@/lib/actions/wang-keluar.actions'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle, ClipboardList, ArrowDownRight, Clock, UserCheck } from 'lucide-react'

const WangKeluarDashboard = async () => {
  const loggedIn = await getLoggedInUser();
  const isAdmin = loggedIn?.role === 'admin';
  
  // Fetch real-time distribution data
  const agihan = await getRecentAgihan() || [];

  // Calculate specific metrics for this mini-dashboard
  const totalDistributed = agihan
    .filter((item: any) => item.status === 'approved')
    .reduce((acc: number, curr: any) => acc + Number(curr.jumlah), 0);

  const pendingCount = agihan.filter((item: any) => item.status === 'pending').length;

  return (
    <section className="flex flex-1 flex-col gap-8 p-8 md:p-12 bg-gray-25 overflow-y-auto overflow-x-hidden">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <HeaderBox 
          title="Pengurusan Wang Keluar" 
          subtext="Pantau agihan bantuan dan status kelulusan dana Musa'adah." 
        />
        
        <div className="flex items-center gap-3">
          <Link href="/wang-keluar/agihan-baru"> 
            <Button className="bg-blue-600 hover:bg-blue-700 !text-white gap-2 shadow-sm text-14">
              <PlusCircle size={18} /> Agihan Baru
            </Button>
          </Link>
          <Link href="/wang-keluar/senarai-agihan">
            <Button variant="outline" className="bg-white border-gray-300 gap-2 shadow-sm text-gray-700 text-14">
              <ClipboardList size={18} /> Rekod Lengkap
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. MINI DASHBOARD STATS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CARD 1: TOTAL DISTRIBUTED (LULUS) */}
        <div className="flex flex-col justify-center gap-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[140px]">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <ArrowDownRight size={20} />
            </div>
            <p className="text-12 font-bold text-gray-500 uppercase tracking-wider">Agihan Telah Lulus</p>
          </div>
          <div className="text-24 font-bold text-red-600">
             <AnimatedCounter amount={totalDistributed} />
          </div>
          <p className="text-11 text-gray-400 italic tracking-tighter">Dana yang telah dikeluarkan</p>
        </div>
        
        {/* CARD 2: PENDING APPROVALS */}
        <div className="flex flex-col justify-center gap-2 bg-white p-6 rounded-xl border border-orange-100 shadow-sm min-h-[140px]">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <Clock size={20} />
            </div>
            <p className="text-12 font-bold text-orange-600 uppercase tracking-wider">Menunggu Kelulusan</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-24 font-bold text-gray-900 leading-none">{pendingCount}</p>
            <span className="text-11 text-orange-600 font-bold uppercase tracking-tighter">Permohonan</span>
          </div>
          <p className="text-11 text-orange-400 italic">* Tindakan segera diperlukan</p>
        </div>

        {/* CARD 3: RECIPIENT TERKINI */}
        <div className="flex flex-col justify-center gap-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[140px]">
           <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <UserCheck size={20} />
            </div>
            <p className="text-12 font-bold text-gray-500 uppercase tracking-wider">Penerima Terkini</p>
          </div>
          <p className="text-18 font-bold text-blue-900 truncate max-w-full">
            {agihan[0]?.penerima || "Tiada Rekod"}
          </p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-gray-100 rounded text-10 font-bold text-gray-500 uppercase">
              Tujuan: {agihan[0]?.tujuan || "N/A"}
            </span>
            <span className="text-10 text-gray-400 font-medium italic">
              {agihan[0]?.tarikhKeluar ? new Date(agihan[0].tarikhKeluar).toLocaleDateString('en-GB') : ""}
            </span>
          </div>
        </div>
      </div>

      {/* 3. TABLE SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h3 className="text-18 font-bold text-gray-900">Senarai Permohonan Terkini</h3>
          <span className="text-10 bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-bold uppercase tracking-tight">
            Menunjukkan 5 rekod terbaru
          </span>
        </div>
        
        <AgihanTable 
          agihan={agihan.slice(0, 5)} 
          isAdmin={isAdmin} 
        />
      </div>
    </section>
  )
}

export default WangKeluarDashboard;