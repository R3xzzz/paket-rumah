import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPackages, logout, deletePackage } from '../lib/actions';
import AdminPackageForm from '../components/AdminPackageForm';
import { LogOut, Trash2, Edit, Package as PackageIcon } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPage({
    searchParams,
}: {
    searchParams?: Promise<{ editId?: string }>;
}) {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('admin_session')?.value === 'true';

    if (!isAdmin) {
        redirect('/admin/login');
    }

    const packages = await getPackages();

    const sp = await searchParams;
    const editId = sp?.editId ? parseInt(sp.editId) : null;
    const packageToEdit = editId ? packages.find(p => p.id === editId) : undefined;

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-gray-900 text-white p-2 rounded-lg">
                        <PackageIcon className="w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/" className="text-gray-500 hover:text-gray-900 font-medium text-sm">
                        Lihat Public View
                    </Link>
                    <form action={logout}>
                        <button className="flex items-center gap-2 text-red-600 font-bold text-sm hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </form>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900">
                                    {packageToEdit ? 'Edit Paket' : 'Tambah Paket Baru'}
                                </h2>
                                {packageToEdit && (
                                    <Link href="/admin" className="text-xs font-bold text-red-600 hover:underline">
                                        Batal Edit
                                    </Link>
                                )}
                            </div>
                            {/* Key is important to reset state when switching between edit/create */}
                            <AdminPackageForm key={editId || 'new'} initialData={packageToEdit as any} />
                        </div>
                    </div>

                    {/* Right Column: List */}
                    <div className="lg:col-span-2">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Daftar Paket ({packages.length})</h2>

                        <div className="space-y-4">
                            {packages.map((pkg) => (
                                <div key={pkg.id} className={`bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition-colors ${pkg.id === editId ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${pkg.isCod ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {pkg.isCod ? 'COD' : 'NON-COD'}
                                            </span>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${pkg.deliveryStatus === 'received' ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-700'}`}>
                                                {pkg.deliveryStatus}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-gray-900">{pkg.packageName}</h3>
                                        <p className="text-sm text-gray-500">{pkg.courier} - {pkg.trackingNumber}</p>
                                        <p className="text-xs text-gray-400 mt-1">To: {pkg.recipientPhone}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin?editId=${pkg.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </Link>

                                        <form action={async () => {
                                            'use server';
                                            await deletePackage(pkg.id);
                                        }}>
                                            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ))}

                            {packages.length === 0 && (
                                <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed">
                                    Belum ada paket logged.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
