import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createVehicle, updateVehicle, deleteVehicle } from './vehicles';

// Mock dependencies
vi.mock('@/lib/db', () => ({
    db: {
        insert: vi.fn(() => ({ values: vi.fn() })),
        delete: vi.fn(() => ({ where: vi.fn() })),
        update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn() })) })),
        select: vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn() })) })),
        query: {
            vehicles: {
                findFirst: vi.fn()
            }
        }
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

describe('updateVehicle Action', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should throw if vehicle not owned by dealer', async () => {
        vi.mocked(checkRole).mockResolvedValue({ id: 'user1', dealerId: 'dealer1' } as any);
        // Mock finding vehicle returns null (not found/owned)
        vi.mocked(db.query.vehicles.findFirst).mockResolvedValue(null);

        const formData = new FormData();
        // data irrelevant
        await expect(updateVehicle('v1', formData)).rejects.toThrow('Vehicle not found or unauthorized');
    });

    it('should update vehicle if authorized', async () => {
        vi.mocked(checkRole).mockResolvedValue({ id: 'user1', dealerId: 'dealer1' } as any);
        vi.mocked(db.query.vehicles.findFirst).mockResolvedValue({ id: 'v1', dealerId: 'dealer1' } as any);

        const setMock = vi.fn().mockReturnValue({ where: vi.fn() });
        vi.mocked(db.update).mockReturnValue({ set: setMock } as any);

        const formData = new FormData();
        formData.append('make', 'Honda');
        formData.append('model', 'Civic');
        formData.append('year', '2023');
        formData.append('price', '25000');
        formData.append('mileage', '500');
        formData.append('status', 'in_stock');
        formData.append('condition', 'used');
        formData.append('vin', 'UPDATEDVIN');
        formData.append('features', '[]');
        formData.append('images', '[]');

        await updateVehicle('v1', formData);

        expect(db.update).toHaveBeenCalled();
        expect(setMock).toHaveBeenCalledWith(expect.objectContaining({
            make: 'Honda'
        }));
    });
});

describe('deleteVehicle Action', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should delete vehicle if authorized', async () => {
        vi.mocked(checkRole).mockResolvedValue({ id: 'user1', dealerId: 'dealer1' } as any);

        // Mock select to find the vehicle first for ownership check
        const whereMock = vi.fn().mockReturnValue([{ id: 'v1', dealerId: 'dealer1', images: [] }]);
        const fromMock = vi.fn().mockReturnValue({ where: whereMock });
        vi.mocked(db.select).mockReturnValue({ from: fromMock } as any);

        await deleteVehicle('v1');

        expect(db.delete).toHaveBeenCalled();
    });
});
