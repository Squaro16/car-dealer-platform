
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createLead, updateLeadStatus } from './leads';

// Mock dependencies
vi.mock('@/lib/db', () => ({
    db: {
        insert: vi.fn(() => ({ values: vi.fn() })),
        select: vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn() })) })),
        update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn() })) })),
        query: {
            leads: {
                findFirst: vi.fn()
            }
        }
    },
}));

vi.mock('@/lib/email', () => ({
    sendLeadNotification: vi.fn(),
}));

vi.mock('@/lib/auth/utils', () => ({
    checkRole: vi.fn(),
    getUserProfile: vi.fn(),
}));

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

import { db } from '@/lib/db';
import { checkRole } from '@/lib/auth/utils';
import { sendLeadNotification } from '@/lib/email';

describe('createLead Action', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should throw if vehicle not found', async () => {
        // Mock db.select returning empty array (vehicle not found)
        const whereMock = vi.fn().mockReturnValue([]);
        const fromMock = vi.fn().mockReturnValue({ where: whereMock });
        vi.mocked(db.select).mockReturnValue({ from: fromMock } as any);

        const formData = new FormData();
        formData.append('vehicleId', 'invalid-id');

        await expect(createLead(formData)).rejects.toThrow('Vehicle not found');
    });

    it('should create lead and send email if vehicle found', async () => {
        // Mock db.select returning vehicle
        const vehicle = { id: 'v1', dealerId: 'dealer1', make: 'Toyota', model: 'Camry', year: 2024 };
        const whereMock = vi.fn().mockReturnValue([vehicle]);
        const fromMock = vi.fn().mockReturnValue({ where: whereMock });
        vi.mocked(db.select).mockReturnValue({ from: fromMock } as any);

        // Mock db.insert
        vi.mocked(db.insert).mockReturnValue({ values: vi.fn() } as any);

        const formData = new FormData();
        formData.append('vehicleId', 'v1');
        formData.append('name', 'John Doe');
        formData.append('email', 'john@example.com');
        formData.append('phone', '1234567890');
        formData.append('message', 'Interested');

        await createLead(formData);

        expect(db.insert).toHaveBeenCalledWith(expect.anything()); // internal table ref
        expect(sendLeadNotification).toHaveBeenCalledWith(expect.objectContaining({
            leadName: 'John Doe',
            vehicleId: 'v1'
        }));
    });
});

describe('updateLeadStatus Action', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should throw if lead not found or unauthorized', async () => {
        vi.mocked(checkRole).mockResolvedValue({ id: 'user1', dealerId: 'dealer1' } as any);
        vi.mocked(db.query.leads.findFirst).mockResolvedValue(null);

        await expect(updateLeadStatus('l1', 'won')).rejects.toThrow('Lead not found or unauthorized');
    });

    it('should update lead status if authorized', async () => {
        vi.mocked(checkRole).mockResolvedValue({ id: 'user1', dealerId: 'dealer1' } as any);
        vi.mocked(db.query.leads.findFirst).mockResolvedValue({ id: 'l1', dealerId: 'dealer1' } as any);

        const setMock = vi.fn().mockReturnValue({ where: vi.fn() });
        vi.mocked(db.update).mockReturnValue({ set: setMock } as any);

        await updateLeadStatus('l1', 'won');

        expect(db.update).toHaveBeenCalled();
        expect(setMock).toHaveBeenCalledWith({ status: 'won' });
    });
});
