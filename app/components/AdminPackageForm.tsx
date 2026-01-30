'use client';

import { useState } from 'react';
import { createPackage, updatePackage } from '../lib/actions';
import { Package } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

const COURIERS = ['JNE', 'J&T', 'SiCepat', 'Shopee Express', 'GoSend', 'Grab', 'Lainnya'];

interface AdminPackageFormProps {
    initialData?: Package;
    onSuccess?: () => void;
}

export default function AdminPackageForm({ initialData, onSuccess }: AdminPackageFormProps) {
    const [loading, setLoading] = useState(false);
    const [isCod, setIsCod] = useState(initialData?.isCod || false);
    const [status, setStatus] = useState(initialData?.deliveryStatus || 'waiting');
    const [message, setMessage] = useState('');

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setMessage('');

        try {
            const data = {
                packageName: formData.get('packageName') as string,
                senderName: formData.get('senderName') as string,
                senderAddress: formData.get('senderAddress') as string,
                courier: formData.get('courier') as string,
                trackingNumber: formData.get('trackingNumber') as string,
                recipientPhone: formData.get('recipientPhone') as string,
                isCod: isCod,
                codAmount: isCod ? Number(formData.get('codAmount')) : undefined,
                deliveryStatus: status,
                receiverName: status === 'waiting' ? null : initialData?.receiverName, // Clear receiver if waiting
            };

            if (initialData) {
                await updatePackage(initialData.id, data);
                setMessage('Paket berhasil diperbarui!');
            } else {
                await createPackage(data);
                setMessage('Paket berhasil ditambahkan!');
                // clear form if needed, or rely on key reset in parent
                const form = document.getElementById('package-form') as HTMLFormElement;
                form?.reset();
                setIsCod(false);
            }

            if (onSuccess) onSuccess();
        } catch (e) {
            console.error(e);
            setMessage('Terjadi kesalahan. Cek data input.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form id="package-form" action={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 border-b pb-2">📦 Konten & Pengirim</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Paket</label>
                        <input
                            name="packageName"
                            defaultValue={initialData?.packageName}
                            required
                            placeholder="Contoh: Baju Anak"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pengirim</label>
                        <input
                            name="senderName"
                            defaultValue={initialData?.senderName}
                            required
                            placeholder="Contoh: Toko ABC"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Pengirim (Opsional)</label>
                        <textarea
                            name="senderAddress"
                            defaultValue={initialData?.senderAddress || ''}
                            rows={2}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-400"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 border-b pb-2">🚚 Logistik & Penerima</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kurir</label>
                        <select
                            name="courier"
                            defaultValue={initialData?.courier || COURIERS[0]}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                        >
                            {COURIERS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Resi (Unik)</label>
                        <input
                            name="trackingNumber"
                            defaultValue={initialData?.trackingNumber}
                            required
                            placeholder="Nomor Resi"
                            className="w-full px-4 py-2 font-mono rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">No. HP Penerima</label>
                        <input
                            name="recipientPhone"
                            defaultValue={initialData?.recipientPhone}
                            required
                            placeholder="0812..."
                            type="tel"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-400"
                        />
                    </div>
                </div>
            </div>

            <div className="border-t pt-4">
                <h3 className="font-bold text-gray-900 mb-4">💰 Pembayaran</h3>

                <div className="flex items-center gap-4 mb-4">
                    <button
                        type="button"
                        onClick={() => setIsCod(!isCod)}
                        className={clsx(
                            "px-4 py-2 rounded-lg font-bold transition-all border-2",
                            isCod ? "bg-red-50 border-red-500 text-red-600" : "bg-gray-50 border-gray-200 text-gray-400"
                        )}
                    >
                        {isCod ? '🔴 COD AKTIF' : '⚪ NON-COD'}
                    </button>
                    <div className="text-sm text-gray-500">
                        {isCod ? 'Paket ini memerlukan pembayaran di tempat.' : 'Paket ini sudah lunas / gratis.'}
                    </div>
                </div>

                {isCod && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Tagihan (Rp)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-2 text-gray-500">Rp</span>
                            <input
                                name="codAmount"
                                type="number"
                                defaultValue={initialData?.codAmount || ''}
                                required={isCod}
                                className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none font-mono font-bold text-lg text-gray-900 placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                )}
            </div>

            {initialData && (
                <div className="border-t pt-4">
                    <h3 className="font-bold text-gray-900 mb-4">🔄 Status Paket</h3>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setStatus(status === 'waiting' ? 'received' : 'waiting')}
                            className={clsx(
                                "px-4 py-2 rounded-lg font-bold transition-all border-2",
                                status === 'received' ? "bg-green-50 border-green-500 text-green-600" : "bg-yellow-50 border-yellow-500 text-yellow-600"
                            )}
                        >
                            {status === 'received' ? '✅ SUDAH DITERIMA' : '⏳ MENUNGGU'}
                        </button>
                        <div className="text-sm text-gray-500">
                            {status === 'waiting'
                                ? 'Paket akan kembali muncul sebagai "belum diterima".'
                                : 'Paket ditandai sebagai sudah selesai.'}
                        </div>
                    </div>
                </div>
            )}

            <div className="pt-4 flex items-center justify-between">
                {message && <p className={clsx("text-sm font-bold", message.includes('ksalahan') ? "text-red-500" : "text-green-600")}>{message}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-gray-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2 ml-auto"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {initialData ? 'Simpan Perubahan' : 'Tambah Paket'}
                </button>
            </div>
        </form>
    );
}
