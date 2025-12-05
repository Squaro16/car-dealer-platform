import CustomerForm from "@/components/customers/customer-form";
import { getCustomer } from "@/lib/actions/customers";
import { notFound } from "next/navigation";

export default async function EditCustomerPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const customer = await getCustomer(id);

    if (!customer) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Edit Customer</h2>
            </div>
            <CustomerForm initialData={customer} />
        </div>
    );
}
