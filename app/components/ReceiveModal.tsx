'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';
import clsx from 'clsx';

interface ReceiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (name: string) => void;
    loading: boolean;
}

export default function ReceiveModal({ isOpen, onClose, onConfirm, loading }: ReceiveModalProps) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Nama penerima wajib diisi');
            return;
        }
        onConfirm(name);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl transform transition-all animate-scale-in overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-lg text-gray-900">Konfirmasi Penerimaan</h3>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Siapa yang menerima paket?
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError('');
                            }}
                            placeholder="Contoh: Ibu, Ayah, Budi"
                            className={clsx(
                                "w-full px-4 py-3 rounded-xl border-2 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-medium",
                                error ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-400"
                            )}
                            autoFocus
                        />
                        {error && (
                            <p className="mt-2 text-sm text-red-500 font-medium flex items-center">
                                <span className="mr-1">⚠️</span> {error}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 active:bg-green-700 shadow-lg shadow-green-200 hover:shadow-green-300 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Check className="w-5 h-5" />
                                    Konfirmasi
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
