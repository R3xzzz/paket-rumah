import { Suspense } from 'react';
import { getPackages } from './lib/actions';
import PackageCard from './components/PackageCard';
import Search from './components/Search';
import Link from 'next/link';
import { PackageOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
  }>;
}) {
  const sp = await searchParams;
  const query = sp?.q || '';
  const packages = await getPackages(query);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/20">
              <PackageOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex-1">
              Paket Rumah
            </h1>
            <Link href="/admin" className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
              Admin
            </Link>
          </div>

          <Search />
        </div>
      </div>

      {/* List */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {packages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <PackageOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Belum ada paket</h3>
            <p className="text-gray-500">
              {query ? 'Tidak ada yang cocok dengan pencarian.' : 'Daftar paket masih kosong.'}
            </p>
          </div>
        ) : (
          packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))
        )}
      </div>

      {/* Footer Text */}
      <div className="text-center text-xs text-gray-400 pb-8">
        Halaman Publik - Read Only
      </div>
    </main>
  );
}
