'use client';

import { useRouter } from 'next/navigation';

export default function Unauthorized() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/admin/dashboard');
  };

  return (
    <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white p-8">
      <div className="text-center space-y-5">
        <h1 className="text-4xl font-bold text-primary">404 - Page not found</h1>
        <p className="text-xl text-muted-foreground">Oops! Saan ka punta?.</p>
        {/* <button
          onClick={handleRedirect}
          className="px-6 py-3 text-white bg-primary rounded-md hover:bg-primary focus:outline-none focus:ring focus:ring-primary-light"
        >
          Go to Dashboard
        </button> */}
      </div>
    </div>
  );
}
