import { getRecentPenerimaan } from "@/lib/actions/dana.actions"
import HeaderBox from "@/components/HeaderBox"
import RecentContributions from "@/components/RecentContributions"
import AnimatedCounter from "@/components/AnimatedCounter"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, List, Wallet, Users, ArrowUpRight } from "lucide-react"

export default async function PenerimaanDanaPage() {
  const transactions = await getRecentPenerimaan() || [];

  // Calculate specific totals for this page
  const totalAmount = transactions.reduce((acc: number, curr: any) => acc + Number(curr.jumlah), 0);
  const totalCount = transactions.length;

  return (
    <section className="flex flex-1 flex-col gap-8 p-8 md:p-12 bg-gray-25 overflow-y-auto overflow-x-hidden">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <HeaderBox 
          title="Penerimaan Dana"
          subtext="Ringkasan keseluruhan sumbangan dan geran yang diterima."
        />
        
        <div className="flex items-center gap-3">
          <Link href="/penerimaan-dana/pendaftaran"> 
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm text-14">
              <PlusCircle size={18} /> Daftar Dana Baru
            </Button>
          </Link>
          <Link href="/penerimaan-dana/rekod">
            <Button variant="outline" className="bg-white border-gray-300 gap-2 shadow-sm text-gray-700 text-14">
              <List size={18} /> Lihat Semua List
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. MINI DASHBOARD STATS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CARD 1: TOTAL DANA MASUK */}
        <div className="flex flex-col justify-center gap-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[140px]">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <ArrowUpRight size={20} />
            </div>
            <p className="text-12 font-bold text-gray-500 uppercase tracking-wider">Jumlah Dana Masuk</p>
          </div>
          <div className="text-24 font-bold text-green-600">
             {/* Note: RM is now handled by AnimatedCounter prefix as we fixed earlier */}
             <AnimatedCounter amount={totalAmount} />
          </div>
          <p className="text-11 text-gray-400 italic">Keseluruhan kutipan setakat ini</p>
        </div>
        
        {/* CARD 2: BILANGAN TRANSAKSI */}
        <div className="flex flex-col justify-center gap-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[140px]">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Wallet size={20} />
            </div>
            <p className="text-12 font-bold text-gray-500 uppercase tracking-wider">Bilangan Transaksi</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-24 font-bold text-gray-900 leading-none">{totalCount}</p>
            <span className="text-11 text-blue-600 font-bold uppercase tracking-tighter">Rekod Berjaya</span>
          </div>
          <p className="text-11 text-gray-400 italic">Jumlah transaksi yang didaftarkan</p>
        </div>

        {/* CARD 3: PENYUMBANG TERKINI */}
        <div className="flex flex-col justify-center gap-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[140px]">
           <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Users size={20} />
            </div>
            <p className="text-12 font-bold text-gray-500 uppercase tracking-wider">Penyumbang Terkini</p>
          </div>
          <p className="text-18 font-bold text-blue-900 truncate max-w-full">
            {transactions[0]?.namaPenyumbang || "Tiada Rekod"}
          </p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-gray-100 rounded text-10 font-mono font-bold text-gray-500">
              ID: {transactions[0]?.$id.slice(-6).toUpperCase() || "N/A"}
            </span>
            <span className="text-10 text-gray-400 font-medium italic">
              {transactions[0]?.tarikhMasuk ? new Date(transactions[0].tarikhMasuk).toLocaleDateString('en-GB') : ""}
            </span>
          </div>
        </div>
      </div>

      {/* 3. PREVIEW TABLE SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h3 className="text-18 font-bold text-gray-900">Kemasukan Terkini</h3>
          <span className="text-10 bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-bold uppercase tracking-tight">
            Menunjukkan 5 rekod terbaru
          </span>
        </div>
        {/* We use the existing table but show only the top 5 to keep the dashboard clean */}
        <RecentContributions transactions={transactions.slice(0, 5)} />
      </div>
    </section>
  )
}