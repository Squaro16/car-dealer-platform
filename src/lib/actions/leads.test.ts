
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

vi.mock('next/headers', () => ({
    headers: vi.fn(() => ({
        get: vi.fn(() => '127.0.0.1'),
    })),
}));

vi.mock('@/lib/security/rate-limit', () => ({
    enforceRateLimit: vi.fn(),
}));

vi.mock('@/lib/security/captcha', () => ({
    verifyCaptchaToken: vi.fn(),
}));

// Helper to mock select().from().leftJoin().where() chain
const buildSelectWithLeftJoin = (whereReturn: unknown) => {
    const whereMock = vi.fn().mockResolvedValue(whereReturn);
    const leftJoinMock = vi.fn(() => ({ where: whereMock }));
    const fromMock = vi.fn(() => ({ leftJoin: leftJoinMock }));
    const selectMock = vi.fn(() => ({ from: fromMock }));
    return { selectMock, leftJoinMock, whereMock, fromMock };
};

import { db } from '@/lib/db';
import { checkRole } from '@/lib/auth/utils';
import { sendLeadNotification } from '@/lib/email';

describe('createLead Action', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should throw if vehicle not found', async () => {
        // Mock db.select + leftJoin chain returning empty array (vehicle not found)
        const { selectMock } = buildSelectWithLeftJoin([]);
        vi.mocked(db.select).mockImplementation(selectMock as any);

        const formData = new FormData();
        formData.append('vehicleId', '00000000-0000-0000-0000-000000000000'); // Valid UUID that doesn't exist
        formData.append('name', 'John Doe');
        formData.append('email', 'john@example.com');
        formData.append('phone', '1234567890');
        formData.append('message', 'Interested');
        formData.append('captchaToken', 'valid-token');

        await expect(createLead(formData)).rejects.toThrow('Vehicle not found');
    });

    it('should create lead and send email if vehicle found', async () => {
        // Mock db.select + leftJoin chain returning vehicle
        const vehicle = { id: 'v1', dealerId: 'dealer1', make: 'Toyota', model: 'Camry', year: 2024 };
        const { selectMock } = buildSelectWithLeftJoin([vehicle]);
        vi.mocked(db.select).mockImplementation(selectMock as any);

        // Mock db.insert
        vi.mocked(db.insert).mockReturnValue({ values: vi.fn() } as any);

        const formData = new FormData();
        formData.append('vehicleId', '00000000-0000-0000-0000-000000000000');
        formData.append('name', 'John Doe');
        formData.append('email', 'john@example.com');
        formData.append('phone', '1234567890');
        formData.append('message', 'Interested');
        formData.append('captchaToken', 'valid-token');

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
        vi.mocked(db.query.leads.findFirst).mockResolvedValue(undefined as any);

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
