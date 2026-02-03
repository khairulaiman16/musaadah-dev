import HeaderBox from '@/components/HeaderBox'
import DisbursementForm from '@/components/DisbursementForm'
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

const AgihanBaruPage = async () => {
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) redirect('/sign-in');

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox 
            type="title"
            title="Permohanan Baru"
            user={loggedIn?.firstName || 'User'}
            subtext="Sila isi borang di bawah untuk membuat permohonan baru."
          />
        </header>

        {/* FIX: Added flex, items-center, and w-full to center the form area */}
        <div className="mt-8 flex flex-col items-center justify-center w-full gap-8">
           <div className="w-full max-w-[850px]">
            <DisbursementForm 
              userId={loggedIn.$id} 
              userName={`${loggedIn.firstName} ${loggedIn.lastName}`} 
            />
           </div>
        </div>
      </div>
    </section>
  )
}

export default AgihanBaruPage;