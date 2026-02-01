import HeaderBox from '@/components/HeaderBox'
import FundForm from '@/components/FundForm'
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

const PendaftaranPage = async () => {
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) redirect('/sign-in');

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox 
            type="title"
            title="Pendaftaran Dana Baru"
            user={loggedIn?.firstName || 'User'}
            subtext="Sila masukkan butiran sumbangan atau geran yang diterima."
          />
        </header>

        {/* FIX: Added 'items-center' to center the child div 
            and 'w-full' to ensure it uses the available horizontal space correctly 
        */}
        <div className="mt-8 flex flex-col items-center justify-center w-full gap-8">
           <div className="w-full max-w-[850px]">
             <FundForm />
           </div>
        </div>
      </div>
    </section>
  )
}

export default PendaftaranPage;