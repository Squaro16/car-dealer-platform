import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createVehicle } from './vehicles';

// Mock dependencies
vi.mock('@/lib/db', () => ({
    db: {
        insert: vi.fn(() => ({
            values: vi.fn(),
        })),
    },
}));

vi.mock('@/lib/auth/utils', () => ({
    checkRole: vi.fn(),
    getUserProfile: vi.fn(),
}));

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
}));

import { db } from '@/lib/db';
import { checkRole } from '@/lib/auth/utils';

describe('createVehicle Action', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should throw if user is not authorized', async () => {
        // Mock checkRole to reject
        vi.mocked(checkRole).mockRejectedValue(new Error('Unauthorized'));

        const formData = new FormData();
        // data doesn't matter here as auth fails first

        await expect(createVehicle(formData)).rejects.toThrow('Unauthorized');
        expect(db.insert).not.toHaveBeenCalled();
    });

    it('should create vehicle if authorized and data is valid', async () => {
        // Mock auth success
        vi.mocked(checkRole).mockResolvedValue({ id: 'user1', dealerId: 'dealer1' } as any);

        // Mock db.insert chain
        const valuesMock = vi.fn().mockResolvedValue([]);
        vi.mocked(db.insert).mockReturnValue({ values: valuesMock } as any);

        const formData = new FormData();
        formData.append('make', 'Toyota');
        formData.append('model', 'Camry');
        formData.append('year', '2024');
        formData.append('price', '30000');
        formData.append('mileage', '0');
        formData.append('status', 'in_stock');
        formData.append('condition', 'new');
        formData.append('vin', 'TESTVIN123'); // required
        formData.append('features', '[]');
        formData.append('images', '[]');

        await createVehicle(formData);

        expect(checkRole).toHaveBeenCalledWith(['admin', 'sales']);
        expect(db.insert).toHaveBeenCalled();
        expect(valuesMock).toHaveBeenCalledWith(expect.objectContaining({
            make: 'Toyota',
            model: 'Camry',
            vin: 'TESTVIN123',
            dealerId: 'dealer1',
            createdById: 'user1'
        }));
    });

    it('should validate input constraints (e.g. valid year)', async () => {
        vi.mocked(checkRole).mockResolvedValue({ id: 'user1', dealerId: 'dealer1' } as any);

        const formData = new FormData();
        formData.append('make', 'Toyota');
        formData.append('model', 'Camry');
        formData.append('year', '1800'); // Invalid year (too old)
        formData.append('price', '30000');
        formData.append('mileage', '0');
        formData.append('status', 'in_stock');
        formData.append('condition', 'new');
        formData.append('vin', 'TESTVIN123');

        // Zod schema should reject this
        await expect(createVehicle(formData)).rejects.toThrow();
        expect(db.insert).not.toHaveBeenCalled();
    });
});
