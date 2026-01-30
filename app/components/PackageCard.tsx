'use client';

import { useState } from 'react';
import { Package, Check, Truck, Box, AlertCircle, ShoppingBag } from 'lucide-react';
import { markPackageAsReceived } from '../lib/actions';
import TrackingModal from './TrackingModal';
import clsx from 'clsx';

interface PackageCardProps {
    pkg: {
        id: number;
        packageName: string;
        senderName: string;
        courier: string;
        trackingNumber: string;
        recipientPhone: string;
        isCod: boolean;
        codAmount: number | null;
        deliveryStatus: string;
    };
}

export default function PackageCard({ pkg }: PackageCardProps) {
    const [isTrackingOpen, setIsTrackingOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const isReceived = pkg.deliveryStatus === 'received';

    // Courier URL mapping
    const getTrackingUrl = (courier: string, trackingNumber: string) => {
        const c = courier.toLowerCase();
        if (c.includes('jne')) return 'https://jne.co.id/tracking-package';
        if (c.includes('j&t') || c.includes('jnt')) return 'https://jet.co.id/track';
        if (c.includes('sicepat')) return 'https://www.sicepat.com/checkAwb';
        if (c.includes('shopee') || c.includes('spx')) return 'https://spx.co.id/';
        return 'https://google.com/search?q=cek+resi+' + courier + '+' + trackingNumber;
    };

    const handleReceived = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const confirm = window.confirm('Tandai paket ini sebagai sudah diterima?');
            if (!confirm) {
                e.target.checked = false;
                return;
            }
            setLoading(true);
            await markPackageAsReceived(pkg.id);
            setLoading(false);
        }
    };

    return (
        <>
            <div className={clsx(
                "relative overflow-hidden rounded-2xl border-2 transition-all duration-200",
                isReceived ? "bg-gray-50 border-gray-200 opacity-75 grayscale-[0.5]" :
                    pkg.isCod ? "bg-white border-red-100 shadow-xl shadow-red-100/50" : "bg-white border-green-100 shadow-xl shadow-green-100/50"
            )}>
                {/* Status Banner */}
                <div className={clsx(
                    "px-4 py-2 font-bold text-center text-sm uppercase tracking-wide",
                    isReceived ? "bg-gray-200 text-gray-500" :
                        pkg.isCod ? "bg-red-500 text-white animate-pulse-slow" : "bg-green-500 text-white"
                )}>
                    {isReceived ? "SUDAH DITERIMA" : pkg.isCod ? "🔴 COD - BAYAR" : "🟢 NON-COD - JANGAN BAYAR"}
                </div>

                <div className="p-5">
                    {/* Header: Name & Price */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">{pkg.packageName}</h3>
                            <div className="flex items-center text-sm text-gray-500 font-medium">
                                <Box className="w-4 h-4 mr-1.5" />
                                {pkg.senderName}
                            </div>
                        </div>
                        {pkg.isCod && pkg.codAmount && (
                            <div className="text-right">
                                <div className="text-sm text-red-600 font-bold">Bayar Sebesar</div>
                                <div className="text-xl font-black text-gray-900">
                                    Rp {pkg.codAmount.toLocaleString('id-ID')}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Warning for COD */}
                    {!isReceived && pkg.isCod && (
                        <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm font-medium flex gap-2 items-start border border-red-100">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p>Cocokkan resi, pengirim, dan harga sebelum bayar.</p>
                        </div>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 gap-3 mb-5">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <div className="text-xs text-gray-400 font-semibold uppercase mb-1">Kurir & Resi</div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center font-semibold text-gray-700">
                                    <Truck className="w-4 h-4 mr-2" />
                                    {pkg.courier}
                                </div>
                                <div className="font-mono text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200 text-sm">
                                    {pkg.trackingNumber}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <div className="text-xs text-gray-400 font-semibold uppercase mb-1">Penerima</div>
                            <div className="text-gray-900 font-medium">
                                {pkg.recipientPhone.replace(/.(?=.{4})/g, '•')}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => setIsTrackingOpen(true)}
                            className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 py-3 rounded-xl font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Lacak Paket
                        </button>

                        <label className={clsx(
                            "flex-1 flex items-center justify-center gap-2 border-2 rounded-xl cursor-pointer transition-all select-none",
                            isReceived ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed" : "border-gray-200 hover:border-green-400 hover:bg-green-50"
                        )}>
                            <input
                                type="checkbox"
                                checked={isReceived}
                                onChange={handleReceived}
                                disabled={isReceived || loading}
                                className="w-5 h-5 rounded text-green-600 focus:ring-green-500"
                            />
                            <span className="font-bold text-gray-600">Sudah Diterima</span>
                        </label>
                    </div>
                </div>
            </div>

            <TrackingModal
                isOpen={isTrackingOpen}
                onClose={() => setIsTrackingOpen(false)}
                phone={pkg.recipientPhone}
                trackingUrl={getTrackingUrl(pkg.courier, pkg.trackingNumber)}
            />
        </>
    );
}
