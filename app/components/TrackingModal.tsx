'use client';

import { X, ExternalLink, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

interface TrackingModalProps {
    isOpen: boolean;
    onClose: () => void;
    phone: string;
    trackingUrl: string;
}

export default function TrackingModal({ isOpen, onClose, phone, trackingUrl }: TrackingModalProps) {
    if (!isOpen) return null;

    const maskedPhone = phone.replace(/.(?=.{4})/g, '•');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity animate-in fade-in backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4 text-amber-600">
                        <ShieldAlert className="w-8 h-8" />
                        <h2 className="text-xl font-bold text-gray-900">Validasi Nomor HP</h2>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Beberapa website pelacakan kurir memerlukan
                        <span className="font-semibold text-gray-900"> 5 digit terakhir nomor HP penerima</span>.
                        <br />
                        Pastikan nomor HP dibawah ini sesuai sebelum melanjutkan.
                    </p>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 text-center">
                        <p className="text-sm text-gray-500 mb-1">Nomor HP Penerima</p>
                        <p className="text-2xl font-mono font-bold tracking-wider text-gray-900">{maskedPhone}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Batal
                        </button>
                        <a
                            href={trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onClose}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                        >
                            Lanjutkan
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
