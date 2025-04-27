import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { VendorForm } from '@/components/vendors/vendor-form';
import { Navbar } from '@/components/layout/navbar';

export default async function CreateVendorPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto py-6">
        <VendorForm />
      </main>
    </div>
  );
}