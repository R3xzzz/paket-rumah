'use client';

import { useFormStatus } from 'react-dom';
import { login } from '@/app/lib/actions';
import { Shield } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
            {pending ? 'Memasuk...' : 'Masuk Admin'}
        </button>
    );
}

export default function LoginPage() {
    const [error, setError] = useState('');
    const router = useRouter();

    async function clientAction(formData: FormData) {
        const res = await login(formData);
        if (res.success) {
            router.push('/admin');
            router.refresh();
        } else {
            setError(res.error || 'Login gagal');
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-100 p-4 rounded-full">
                        <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Admin Access</h1>

                <form action={clientAction} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-400"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <SubmitButton />
                </form>
            </div>
        </main>
    );
}
