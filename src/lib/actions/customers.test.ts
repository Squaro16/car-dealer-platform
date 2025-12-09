// Tests customer server actions for auth, validation, and cache effects.
// Ensures create and update keep dealer scoping and trigger navigation.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createCustomer, updateCustomer } from "./customers";
import { db } from "@/lib/db";
import { checkRole } from "@/lib/auth/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

vi.mock("@/lib/db", () => ({
    db: {
        insert: vi.fn(() => ({ values: vi.fn() })),
        update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn() })) })),
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

describe("createCustomer", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("throws when user is unauthorized", async () => {
        vi.mocked(checkRole).mockRejectedValue(new Error("Unauthorized"));

        const formData = new FormData();

        await expect(createCustomer(formData)).rejects.toThrow("Unauthorized");
        expect(db.insert).not.toHaveBeenCalled();
    });

    it("creates customer, scopes to dealer, revalidates, and redirects", async () => {
        vi.mocked(checkRole).mockResolvedValue({ id: "user-1", dealerId: "dealer-1" } as any);

        const valuesMock = vi.fn();
        vi.mocked(db.insert).mockReturnValue({ values: valuesMock } as any);

        const formData = new FormData();
        formData.append("name", "Jane Doe");
        formData.append("email", "jane@example.com");
        formData.append("phone", "12345678");
        formData.append("address", "123 Street");
        formData.append("idNumber", "ID-1");
        formData.append("notes", "VIP customer");

        await createCustomer(formData);

        expect(checkRole).toHaveBeenCalledWith(["admin", "sales"]);
        expect(valuesMock).toHaveBeenCalledWith(
            expect.objectContaining({
                name: "Jane Doe",
                dealerId: "dealer-1",
            })
        );
        expect(revalidatePath).toHaveBeenCalledWith("/dashboard/customers");
        expect(redirect).toHaveBeenCalledWith("/dashboard/customers");
    });
});

describe("updateCustomer", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("rejects invalid payload", async () => {
        vi.mocked(checkRole).mockResolvedValue({ id: "user-1", dealerId: "dealer-1" } as any);

        const formData = new FormData();
        formData.append("name", "A"); // too short
        formData.append("email", "bad-email");
        formData.append("phone", "123"); // too short

        await expect(updateCustomer("cust-1", formData)).rejects.toThrow();
        expect(db.update).not.toHaveBeenCalled();
    });

    it("updates customer for dealer and triggers revalidation", async () => {
        vi.mocked(checkRole).mockResolvedValue({ id: "user-1", dealerId: "dealer-1" } as any);

        const whereMock = vi.fn();
        const setMock = vi.fn(() => ({ where: whereMock }));
        vi.mocked(db.update).mockReturnValue({ set: setMock } as any);

        const formData = new FormData();
        formData.append("name", "Updated Name");
        formData.append("email", "updated@example.com");
        formData.append("phone", "98765432");
        formData.append("notes", "updated notes");
    formData.append("address", "");
    formData.append("idNumber", "");

        await updateCustomer("cust-1", formData);

        expect(setMock).toHaveBeenCalledWith(
            expect.objectContaining({
                name: "Updated Name",
                email: "updated@example.com",
            })
        );
        expect(whereMock).toHaveBeenCalled();
        expect(revalidatePath).toHaveBeenCalledWith("/dashboard/customers");
        expect(revalidatePath).toHaveBeenCalledWith("/dashboard/customers/cust-1");
        expect(redirect).toHaveBeenCalledWith("/dashboard/customers");
    });
});

