
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFinancialMetrics } from './analytics';

// Mock DB
vi.mock('@/lib/db', () => ({
    db: {
        select: vi.fn(),
    },
}));

vi.mock('@/lib/auth/utils', () => ({
    getUserProfile: vi.fn(),
    checkRole: vi.fn(),
}));

import { db } from '@/lib/db';
import { getUserProfile } from '@/lib/auth/utils';

describe('getFinancialMetrics Action', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should calculate net profit correctly', async () => {
        vi.mocked(getUserProfile).mockResolvedValue({ id: 'user1', dealerId: 'dealer1' } as any);

        // Mock chained DB calls
        // 1. Revenue
        const fromRevenue = vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue([{ totalRevenue: 100000 }]) });
        const selectRevenue = vi.fn().mockReturnValue({ from: fromRevenue });

        // 2. Expenses
        const fromExpenses = vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue([{ totalExpenses: 20000 }]) });
        const selectExpenses = vi.fn().mockReturnValue({ from: fromExpenses });

        // 3. COGS (innerJoin complexity)
        const innerJoinCogs = vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue([{ totalCost: 50000 }]) });
        const fromCogs = vi.fn().mockReturnValue({ innerJoin: innerJoinCogs });
        const selectCogs = vi.fn().mockReturnValue({ from: fromCogs });

        // Setup db.select to return different mocks based on call order or inspection could be tricky.
        // But since db.select is called 3 times sequentially, we can try mockReturnValueOnce logic or just return a mock that handles all.
        // However, the calls are:
        // 1. db.select({...}).from(sales)...
        // 2. db.select({...}).from(expenses)...
        // 3. db.select({...}).from(sales).innerJoin...

        // A simpler way is to mock implementation of db.select to return a chainable object
        // that eventually resolves to what we want based on which "from" or "table" was visited?
        // Too complex. Let's rely on checking arguments or using mockReturnValueOnce if deterministic.

        // The function calls: 1. Revenue, 2. Expenses, 3. COGS.
        // So we can mock db.select to return the start of the chain for each call.

        vi.mocked(db.select)
            .mockReturnValueOnce({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockResolvedValue([{ totalRevenue: 100000 }])
                })
            } as any) // Call 1: Revenue
            .mockReturnValueOnce({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockResolvedValue([{ totalExpenses: 20000 }])
                })
            } as any) // Call 2: Expenses
            .mockReturnValueOnce({
                from: vi.fn().mockReturnValue({
                    innerJoin: vi.fn().mockReturnValue({
                        where: vi.fn().mockResolvedValue([{ totalCost: 50000 }])
                    })
                })
            } as any); // Call 3: COGS

        const metrics = await getFinancialMetrics();

        // Revenue: 100,000
        // Expenses: 20,000
        // COGS: 50,000
        // Net Profit = 100k - 20k - 50k = 30,000
        expect(metrics.totalRevenue).toBe(100000);
        expect(metrics.totalExpenses).toBe(20000);
        expect(metrics.totalCOGS).toBe(50000);
        expect(metrics.netProfit).toBe(30000);
    });
});
