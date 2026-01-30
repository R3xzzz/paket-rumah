'use server';

import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma, Package } from '@prisma/client';
import { cookies } from 'next/headers';

// Public Actions
export async function getPackages(query?: string) {
    const where: Prisma.PackageWhereInput = query
        ? {
            OR: [
                { trackingNumber: { contains: query } },
                { senderName: { contains: query } },
                { courier: { contains: query } },
            ],
        }
        : {};

    const packages = await prisma.package.findMany({
        where,
        orderBy: [
            { deliveryStatus: 'asc' }, // Waiting first (alphabetical 'waiting' > 'received'? No 'w' > 'r' so 'received' comes first? Wait.
            // waiting vs received. r < w. So asc means received first.
            // Requirement: Sort priority: 1. Not received, 2. COD first, 3. Non, 4. Received.
            // This complex sorting might be easier in JS or raw SQL, but let's try Prisma orderBy.
            // Actually, let's just fetch and sort in memory if the dataset is small, or use multiple orderBys.
            // Delivery status: 'waiting' | 'received'.
            // We want 'waiting' first. 'w' > 'r'. So desc.
            { deliveryStatus: 'desc' },
            { isCod: 'desc' }, // true > false ? true is 1? usually boolean sorting varies.
            { createdAt: 'desc' },
        ],
    });

    // Custom sort in memory to be safe and match specific business logic if Prisma is limited
    // Priority: 
    // 1. Waiting & COD
    // 2. Waiting & Non-COD
    // 3. Received

    return packages.sort((a: Package, b: Package) => {
        if (a.deliveryStatus === 'waiting' && b.deliveryStatus === 'received') return -1;
        if (a.deliveryStatus === 'received' && b.deliveryStatus === 'waiting') return 1;

        if (a.deliveryStatus === 'waiting' && b.deliveryStatus === 'waiting') {
            if (a.isCod && !b.isCod) return -1;
            if (!a.isCod && b.isCod) return 1;
        }

        return b.createdAt.getTime() - a.createdAt.getTime();
    });
}

export async function markPackageAsReceived(id: number, receiverName: string) {
    await prisma.package.update({
        where: { id },
        data: {
            deliveryStatus: 'received',
            receiverName,
            receivedAt: new Date(),
        },
    });
    revalidatePath('/');
}

// Admin Actions
export async function login(formData: FormData) {
    const password = formData.get('password');
    if (password === process.env.ADMIN_PASSWORD) {
        (await cookies()).set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });
        return { success: true };
    }
    return { success: false, error: 'Password salah' };
}

export async function logout() {
    (await cookies()).delete('admin_session');
    redirect('/');
}

export async function verifyAdmin(formData: FormData) {
    const password = formData.get('password');
    if (password === process.env.ADMIN_PASSWORD) {
        return true;
    }
    return false;
}

export async function createPackage(data: {
    packageName: string;
    senderName: string;
    senderAddress?: string;
    courier: string;
    trackingNumber: string;
    recipientPhone: string;
    isCod: boolean;
    codAmount?: number;
}) {
    await prisma.package.create({
        data: {
            ...data,
            deliveryStatus: 'waiting',
        },
    });
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function deletePackage(id: number) {
    await prisma.package.delete({
        where: { id },
    });
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function updatePackage(id: number, data: any) {
    // Handle receivedAt timestamp logic
    if (data.deliveryStatus === 'received') {
        data.receivedAt = new Date();
    } else if (data.deliveryStatus === 'waiting') {
        data.receivedAt = null;
    }

    await prisma.package.update({
        where: { id },
        data,
    });
    revalidatePath('/');
    revalidatePath('/admin');
}
