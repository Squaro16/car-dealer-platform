// Tests sales server actions to ensure auth, validation, and side effects behave.
// Covers rejection scenarios and successful transaction updates with cache refresh.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createSale } from "./sales";
import { db } from "@/lib/db";
import { checkRole } from "@/lib/auth/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

vi.mock("@/lib/db", () => ({
    db: {
        transaction: vi.fn(),
        query: {
            sales: { findMany: vi.fn() },
        },
    },
}));

vi.mock("@/lib/auth/utils", () => ({
    checkRole: vi.fn(),
    getUserProfile: vi.fn(),
}));

vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    redirect: vi.fn(),
}));

function createSaleFormData(overrides: Partial<Record<string, string>> = {}) {
    const formData = new FormData();
    formData.append("vehicleId", "00000000-0000-0000-0000-000000000000");
    formData.append("customerId", "ffffffff-ffff-ffff-ffff-ffffffffffff");
    formData.append("salePrice", "50000");
    formData.append("paymentMethod", "cash");
    formData.append("notes", "Test note");
    formData.append("saleDate", "2024-01-01");

    Object.entries(overrides).forEach(([key, value]) => {
        if (value !== undefined) {
            formData.set(key, value);
        }
    });

    return formData;
}

describe("createSale", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("throws when user is unauthorized", async () => {
        vi.mocked(checkRole).mockRejectedValue(new Error("Unauthorized"));

        const formData = createSaleFormData();

        await expect(createSale(formData)).rejects.toThrow("Unauthorized");
        expect(db.transaction).not.toHaveBeenCalled();
    });

    it("rejects invalid payloads before running transaction", async () => {
        vi.mocked(checkRole).mockResolvedValue({ id: "user-1", dealerId: "dealer-1" } as any);

        const formData = createSaleFormData({ vehicleId: "" });

        await expect(createSale(formData)).rejects.toThrow();
        expect(db.transaction).not.toHaveBeenCalled();
    });

    it("creates sale, updates vehicle, and revalidates paths", async () => {
        vi.mocked(checkRole).mockResolvedValue({ id: "user-1", dealerId: "dealer-1" } as any);

        const insertValues = vi.fn().mockResolvedValue(undefined);
        const updateWhere = vi.fn().mockResolvedValue(undefined);
        const updateSet = vi.fn(() => ({ where: updateWhere }));
        const leadsFindMany = vi.fn().mockResolvedValue([]);

        const tx = {
            insert: vi.fn(() => ({ values: insertValues })),
            update: vi.fn(() => ({ set: updateSet })),
            query: {
                leads: {
                    findMany: leadsFindMany,
                },
            },
        };

        vi.mocked(db.transaction).mockImplementation(async (cb) => {
            await cb(tx as any);
            return undefined as any;
        });

        const formData = createSaleFormData();

        await createSale(formData);

        expect(checkRole).toHaveBeenCalledWith(["admin", "sales"]);
        expect(tx.insert).toHaveBeenCalled();
        expect(insertValues).toHaveBeenCalledWith(
            expect.objectContaining({
                vehicleId: "00000000-0000-0000-0000-000000000000",
                customerId: "ffffffff-ffff-ffff-ffff-ffffffffffff",
                dealerId: "dealer-1",
                sellerId: "user-1",
                paymentMethod: "cash",
            })
        );
        expect(tx.update).toHaveBeenCalled();
        expect(updateSet).toHaveBeenCalledWith({ status: "sold" });
        expect(leadsFindMany).toHaveBeenCalled();
        expect(revalidatePath).toHaveBeenCalledWith("/dashboard/inventory");
        expect(revalidatePath).toHaveBeenCalledWith("/dashboard/sales");
        expect(redirect).toHaveBeenCalledWith("/dashboard/sales");
    });
});

