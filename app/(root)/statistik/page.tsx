import HeaderBox from '@/components/HeaderBox'
import { getFilteredReports } from '@/lib/actions/report.actions'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import ReportFilters from '@/components/ReportFilters'
import MasterLedger from '@/components/MasterLedger'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, FileText, PieChart } from 'lucide-react'
import Link from 'next/link' // Added for URL-based tab switching

const StatistikLaporan = async ({ searchParams }: SearchParamProps) => {
  // Destructure searchParams to get current active type
  const { type = 'masuk', start, end, kategori } = searchParams;
  const loggedIn = await getLoggedInUser();

  // This fetch now correctly re-runs whenever 'type' in the URL changes
  const data = await getFilteredReports({
    type: type as 'masuk' | 'keluar',
    startDate: start as string,
    endDate: end as string,
    kategori: kategori as string
  });

  const totalAmount = data.reduce((acc: number, curr: any) => acc + Number(curr.jumlah), 0);
  const isAdmin = loggedIn?.role === 'admin';

  return (
    <section className="flex flex-1 flex-col gap-8 p-8 md:p-12 bg-gray-25 overflow-y-auto no-scrollbar">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <HeaderBox 
          title="Statistik & Laporan"
          subtext="Analisis mendalam aliran tunai mengikut kategori."
        />
        <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm">
          <Calendar size={16} className="text-blue-600" />
          <span className="text-12 font-bold text-gray-600 uppercase tracking-tight">
            Sesi: {new Date().getFullYear()}
          </span>
        </div>
      </div>

      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
        <ReportFilters />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-blue-600 rounded-2xl p-8 text-white flex justify-between items-center shadow-lg relative overflow-hidden">
          <div className="z-10">
            <p className="text-12 opacity-80 uppercase tracking-[0.2em] font-bold">
              Jumlah Keseluruhan ({type === 'masuk' ? 'Dana Diterima' : 'Wang Keluar'})
            </p>
            <h2 className="text-36 md:text-48 font-black mt-2 leading-none">
              RM {totalAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center gap-2 mt-6 opacity-80">
                <FileText size={14} />
                <p className="text-11 font-medium uppercase tracking-wider italic">
                  Laporan Berdasarkan {data.length} Rekod
                </p>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
           <div className="flex items-center gap-2 mb-4">
              <PieChart size={16} className="text-blue-500" />
              <p className="text-11 font-bold text-gray-400 uppercase tracking-widest">Kategori</p>
           </div>
           <p className="text-18 font-bold text-gray-900 truncate">
             {kategori && kategori !== 'all' ? kategori : "Semua Kategori"}
           </p>
           <div className="mt-4 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
             <div className="bg-blue-600 h-full w-full" /> 
           </div>
        </div>
      </div>

      {/* FIXED TABS: Using Link to force a data refresh on click */}
      <Tabs defaultValue={type as string} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList className="bg-gray-100 p-1 rounded-xl">
            <Link href="?type=masuk">
              <TabsTrigger value="masuk" className="px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 text-12 font-bold transition-all">
                Penerimaan Dana
              </TabsTrigger>
            </Link>
            <Link href="?type=keluar">
              <TabsTrigger value="keluar" className="px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 text-12 font-bold transition-all">
                Wang Keluar
              </TabsTrigger>
            </Link>
          </TabsList>
          
          <p className="text-12 text-gray-400 font-medium italic">
             Memaparkan perincian mengikut {type === 'masuk' ? 'Penyumbang' : 'Penerima'}
          </p>
        </div>
        
        {/* Only render content for the active type to prevent mixed data */}
        <TabsContent value={type as string} className="mt-0 outline-none">
           <MasterLedger data={data} type={type as 'masuk' | 'keluar'} isAdmin={isAdmin} />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default StatistikLaporan;