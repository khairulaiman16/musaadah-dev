import HeaderBox from '@/components/HeaderBox'
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { getRecentAgihan } from "@/lib/actions/wang-keluar.actions"
import { redirect } from 'next/navigation';
import AgihanTable from '@/components/AgihanTable';

const SenaraiAgihanPage = async () => {
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) redirect('/sign-in');

  const isAdmin = loggedIn.role === 'admin';
  const agihan = await getRecentAgihan();

  return (
    <section className="flex h-screen w-full flex-col overflow-y-auto bg-gray-25">
      <div className="flex flex-col gap-8 px-5 py-8 md:px-8 lg:gap-12 w-full max-w-[1600px] mx-auto">
        <header className="home-header">
          <HeaderBox 
            type="title"
            title="Senarai Agihan Dana"
            user={loggedIn?.firstName || 'User'}
            subtext="Semak status permohonan dan urus kelulusan dana."
          />
        </header>

        <div className="w-full">
            {/* Pass the data and the admin status to the table */}
            <AgihanTable agihan={agihan} isAdmin={isAdmin} />
        </div>
      </div>
    </section>
  )
}

export default SenaraiAgihanPage;