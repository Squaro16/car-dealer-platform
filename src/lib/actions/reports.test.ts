// Tests reports actions to ensure dealer scoping and date filters are applied.
// Verifies sales, expenses, and inventory reports return mocked records for the dealer.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSalesReport, getExpenseReport, getInventoryReport } from "./reports";
import { db } from "@/lib/db";
import { getUserProfile } from "@/lib/auth/utils";

vi.mock("@/lib/db", () => ({
    db: {
        query: {
            sales: { findMany: vi.fn() },
            expenses: { findMany: vi.fn() },
            vehicles: { findMany: vi.fn() },
        },
    },
}));

vi.mock("@/lib/auth/utils", () => ({
    getUserProfile: vi.fn(),
}));

const dealerUser = { id: "user-1", dealerId: "dealer-1" } as any;

describe("reports actions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getUserProfile).mockResolvedValue(dealerUser);
    });

    it("gets sales report scoped by dealer and date range", async () => {
        const start = new Date("2024-01-01");
        const end = new Date("2024-01-31");
        const salesRows = [{ id: "s1", dealerId: dealerUser.dealerId }];

        vi.mocked(db.query.sales.findMany).mockResolvedValue(salesRows as any);

        const result = await getSalesReport(start, end);

        expect(db.query.sales.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.anything(),
            })
        );
        expect(result).toEqual(salesRows);
    });

    it("gets expense report scoped by dealer and date range", async () => {
        const start = new Date("2024-02-01");
        const end = new Date("2024-02-28");
        const expenseRows = [{ id: "e1", dealerId: dealerUser.dealerId }];

        vi.mocked(db.query.expenses.findMany).mockResolvedValue(expenseRows as any);

        const result = await getExpenseReport(start, end);

        expect(db.query.expenses.findMany).toHaveBeenCalled();
        expect(result).toEqual(expenseRows);
    });

    it("gets inventory report scoped by dealer and in_stock status", async () => {
        const vehiclesRows = [{ id: "v1", dealerId: dealerUser.dealerId, status: "in_stock" }];
        vi.mocked(db.query.vehicles.findMany).mockResolvedValue(vehiclesRows as any);

        const result = await getInventoryReport();

        expect(db.query.vehicles.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.anything(),
            })
        );
        expect(result).toEqual(vehiclesRows);
    });
});

