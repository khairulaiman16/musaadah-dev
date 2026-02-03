// app/(root)/urussetia/page.tsx
import HeaderBox from '@/components/HeaderBox'
import DisbursementForm from '@/components/DisbursementForm'
import AgihanTable from '@/components/AgihanTable'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { getRecentAgihan } from '@/lib/actions/wang-keluar.actions'
import { FileEdit, ListChecks } from 'lucide-react'

export default async function UrussetiaPage() {
  const loggedIn = await getLoggedInUser();
  const agihan = await getRecentAgihan();

  // Urus Setia focuses on execution and tracking their own submissions
  return (
    <section className="flex h-screen w-full flex-col overflow-y-auto bg-gray-25 p-6 md:p-10 no-scrollbar">
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-10">
        
        <header className="flex flex-col gap-4">
          <HeaderBox 
            type="greeting"
            title="Portal Kemasukan Data Urus Setia"
            user={loggedIn?.firstName || 'User'}
            subtext="Lengkapkan borang agihan dana di bawah dengan teliti untuk semakan BOD."
          />
          
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100 w-fit shadow-sm">
             <FileEdit size={16} />
             <span className="text-12 font-bold uppercase tracking-tight">Mod Input Aktif</span>
          </div>
        </header>

        <div className="flex flex-col gap-12">
          {/* PRIMARY WORK AREA: THE FORM */}
          <section className="flex flex-col gap-4">
            <h2 className="text-18 font-bold text-gray-900 px-1 italic flex items-center gap-2">
              <FileEdit size={20} className="text-blue-600" />
              Pendaftaran Agihan Baru
            </h2>
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
               <DisbursementForm 
                userId={loggedIn.$id} 
                userName={`${loggedIn.firstName} ${loggedIn.lastName}`} 
                /> 
            </div>
          </section>

          {/* SECONDARY AREA: RECENT LOGS */}
          <section className="flex flex-col gap-4 pb-10">
             <div className="flex items-center justify-between px-1">
                <h2 className="text-18 font-bold text-gray-900 flex items-center gap-2">
                  <ListChecks size={20} className="text-blue-600" />
                  Status Permohonan Terkini
                </h2>
             </div>
             {/* isAdmin={false} ensures Urus Setia cannot manually change approval statuses */}
             <AgihanTable agihan={agihan.slice(0, 10)} isAdmin={false} /> 
          </section>
        </div>
      </div>
    </section>
  )
}