import { getRecentAgihan } from '@/lib/actions/wang-keluar.actions';
import { getLoggedInUser } from "@/lib/actions/user.actions";
import HeaderBox from "@/components/HeaderBox";
import BODActionCard from "@/components/BODActionCard";
import AgihanTable from "@/components/AgihanTable";
import { ClipboardList, CheckCircle2, Clock, CheckSquare } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function BODDashboard({ searchParams }: { searchParams: { tab?: string } }) {
  const user = await getLoggedInUser();
  const allAgihan = await getRecentAgihan();
  const activeTab = searchParams.tab || 'pending';

  // Filter 1: Pending tasks requiring THIS user's action
  const pendingApprovals = allAgihan.filter((item: any) => 
    (item.status === 'pending' || item.status === 'kiv') && 
    !item.approvals?.includes(user?.$id) &&
    !item.rejections?.includes(user?.$id)
  );

  // Filter 2: Tasks already settled by THIS user
  const settledByMe = allAgihan.filter((item: any) => 
    item.approvals?.includes(user?.$id) || 
    item.rejections?.includes(user?.$id)
  );

  // Filter 3: History of what has already been processed (Summary for the table)
  const processedAgihan = allAgihan.filter((item: any) => 
    item.status === 'approved' || item.status === 'rejected'
  );

  return (
    <section className="flex h-screen w-full flex-col overflow-y-auto bg-gray-25 p-6 md:p-10 no-scrollbar">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8">
        
        {/* Header Section - Standard Gov Style */}
        <header className="flex flex-col gap-2">
          <HeaderBox 
            type="greeting"
            title="Panel Kelulusan Ketua Jabatan"
            user={user?.firstName || 'User'}
            subtext="Semak dan berikan kelulusan bagi permohonan agihan dana Musa'adah."
          />
        </header>

        {/* Top Summary Metrics - Standardized with Reference UI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-1">
            <p className="text-14 font-medium text-gray-500 uppercase tracking-wider">Tugasan Aktif</p>
            <div className="flex items-end gap-2">
              <p className="text-30 font-bold text-orange-600">{pendingApprovals.length}</p>
              <p className="text-14 text-gray-400 mb-1">Permohonan</p>
            </div>
            <p className="text-12 text-gray-400 mt-2 italic">* Memerlukan tindakan segera</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-1">
            <p className="text-14 font-medium text-gray-500 uppercase tracking-wider">Status Konsensus</p>
            <div className="flex items-end gap-2">
              <p className="text-30 font-bold text-blue-600">
                {allAgihan.filter((a: any) => a.status === 'pending').length}
              </p>
              <p className="text-14 text-gray-400 mb-1">Dalam Proses</p>
            </div>
            <p className="text-12 text-gray-400 mt-2 italic">Sistem pengundian sedang berjalan</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-1">
            <p className="text-14 font-medium text-gray-500 uppercase tracking-wider">Jumlah Selesai</p>
            <div className="flex items-end gap-2">
              <p className="text-30 font-bold text-green-600">{processedAgihan.length}</p>
              <p className="text-14 text-gray-400 mb-1">Rekod Terperinci</p>
            </div>
            <p className="text-12 text-gray-400 mt-2 italic">Data dikemaskini secara langsung</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 gap-8">
          
          {/* Section 1: Pending Actions (The Cards) with Tabs */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center border-b border-gray-200">
              <Link 
                href="/bod-dashboard?tab=pending"
                className={cn(
                  "flex items-center gap-2 px-6 py-4 text-14 font-bold transition-all relative",
                  activeTab === 'pending' ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Clock size={18} />
                TINDAKAN SAYA ({pendingApprovals.length})
                {activeTab === 'pending' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
              </Link>
              <Link 
                href="/bod-dashboard?tab=settled"
                className={cn(
                  "flex items-center gap-2 px-6 py-4 text-14 font-bold transition-all relative",
                  activeTab === 'settled' ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <CheckSquare size={18} />
                KELULUSAN SAYA ({settledByMe.length})
                {activeTab === 'settled' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
              </Link>
            </div>
            
            <div className="flex flex-col gap-4">
              {activeTab === 'pending' ? (
                pendingApprovals.length > 0 ? (
                  pendingApprovals.map((item: any) => (
                    <BODActionCard key={item.$id} item={item} userId={user?.$id} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
                    <CheckCircle2 size={32} className="text-gray-300 mb-2" />
                    <p className="text-gray-500 font-medium">Tiada permohonan menunggu kelulusan anda.</p>
                  </div>
                )
              ) : (
                settledByMe.length > 0 ? (
                  settledByMe.map((item: any) => (
                    <BODActionCard key={item.$id} item={item} userId={user?.$id} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
                    <CheckSquare size={32} className="text-gray-300 mb-2" />
                    <p className="text-gray-500 font-medium">Anda belum meluluskan sebarang rekod lagi.</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Section 2: Recent History (The Table) - Matches Reference UI Style */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <ClipboardList size={20} className="text-blue-600" />
                <h2 className="text-18 font-bold text-gray-900">Rekod Keputusan Terkini</h2>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <AgihanTable agihan={allAgihan.slice(0, 5)} isAdmin={false} />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}