import HeaderBox from '@/components/HeaderBox'
import CommitteeForm from '@/components/CommitteeForm'
import RoleManagement from '@/components/RoleManagement'
import AttendanceTracker from '@/components/AttendanceTracker'
import { getLoggedInUser, getAllUsers } from '@/lib/actions/user.actions';
import { getCommitteeMembers } from '@/lib/actions/jawatankuasa'; // You'll need this action
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, CalendarCheck, ShieldAlert } from 'lucide-react'

const JawatankuasaPage = async () => {
  const loggedIn = await getLoggedInUser();
  if (loggedIn?.role !== 'admin') redirect('/');

  const allUsers = await getAllUsers();
  const committeeMembers = await getCommitteeMembers(); // Fetch the registered members

  return (
    <section className="flex flex-1 flex-col gap-8 p-8 md:p-12 bg-gray-25 overflow-y-auto overflow-x-hidden">
      <HeaderBox 
        title="Pengurusan Jawatankuasa"
        subtext="Urus profil lantikan, rekod kehadiran mesyuarat, dan kawal akses sistem."
      />

      <Tabs defaultValue="lantikan" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[600px] mb-8 bg-gray-100 p-1">
          <TabsTrigger value="lantikan" className="gap-2">
            <Users size={16} /> Profil & Lantikan
          </TabsTrigger>
          <TabsTrigger value="kehadiran" className="gap-2">
            <CalendarCheck size={16} /> Kehadiran
          </TabsTrigger>
          <TabsTrigger value="akses" className="gap-2">
            <ShieldAlert size={16} /> Kawalan Akses
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: REGISTRATION & LIST */}
        <TabsContent value="lantikan" className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-1">
                <CommitteeForm />
              </div>
              <div className="xl:col-span-2">
                {/* We can add a Table here later to show current members */}
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                   <h3 className="font-bold mb-4">Senarai Lantikan Aktif</h3>
                   <p className="text-12 text-gray-500 italic">Gunakan borang untuk menambah ahli baru.</p>
                </div>
              </div>
            </div>
        </TabsContent>

        {/* TAB 2: ATTENDANCE TRACKER */}
        <TabsContent value="kehadiran" className="animate-in fade-in duration-500">
            <AttendanceTracker members={committeeMembers} />
        </TabsContent>

        {/* TAB 3: ROLE MANAGEMENT */}
        <TabsContent value="akses" className="animate-in fade-in duration-500">
            <RoleManagement users={allUsers} />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default JawatankuasaPage