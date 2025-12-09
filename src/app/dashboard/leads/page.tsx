// Admin leads table showing inquiries and linked vehicles.
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getLeads } from "@/lib/actions/leads";
import { LeadStatusUpdate } from "@/components/dashboard/lead-status-update";

function getMakeName(vehicle: { make: string | null } | null | undefined) {
    if (!vehicle) return "";
    return vehicle.make ?? "";
}

export default async function LeadsPage() {
    const leads = await getLeads();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Interest</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.map((lead) => (
                            <TableRow key={lead.id}>
                                <TableCell>
                                    <div className="font-medium">{lead.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {lead.email} • {lead.phone}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {lead.vehicle ? (
                                        <span>
                                            {lead.vehicle.year} {getMakeName(lead.vehicle)} {lead.vehicle.model}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground">General Inquiry</span>
                                    )}
                                </TableCell>
                                <TableCell className="capitalize">{lead.source}</TableCell>
                                <TableCell>
                                    <LeadStatusUpdate leadId={lead.id} currentStatus={lead.status} />
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
