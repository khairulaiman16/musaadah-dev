import HeaderBox from '@/components/HeaderBox'
import RecentContributions from '@/components/RecentContributions'
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { getRecentPenerimaan } from "@/lib/actions/dana.actions"
import { redirect } from 'next/navigation';

const RekodPage = async () => {
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) redirect('/sign-in');

  const transactions: Transaction[] = await getRecentPenerimaan();

  return (
    // Changed to 'flex-1' and 'w-full' to ensure it takes available space correctly
    <section className="flex h-screen w-full flex-col overflow-y-auto bg-gray-25">
      <div className="flex flex-col gap-8 px-5 py-8 md:px-8 lg:gap-12 w-full max-w-[1600px] mx-auto">
        <header className="home-header">
          <HeaderBox 
            type="title"
            title="Rekod Transaksi"
            user={loggedIn?.firstName || 'User'}
            subtext="Lihat dan urus sejarah transaksi penerimaan dana."
          />
        </header>

        {/* Removed 'flex-col' gap to allow table to own its spacing */}
        <div className="w-full">
            <RecentContributions transactions={transactions} />
        </div>
      </div>
    </section>
  )
}

export default RekodPage;