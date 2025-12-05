"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUserRole } from "@/lib/actions/settings";
import { toast } from "sonner";
import { useState } from "react";

interface User {
    id: string;
    name: string | null;
    email: string;
    role: "admin" | "sales" | "service" | "viewer";
}

interface UserManagementProps {
    users: User[];
    currentUserId: string;
}

export function UserManagement({ users, currentUserId }: UserManagementProps) {
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const handleRoleChange = async (userId: string, newRole: string) => {
        setIsUpdating(userId);
        try {
            await updateUserRole(userId, newRole as "admin" | "sales" | "service" | "viewer");
            toast.success("User role updated");
        } catch (error) {
            toast.error("Failed to update role");
            console.error(error);
        } finally {
            setIsUpdating(null);
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>{user.name || "N/A"}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                            <Select
                                defaultValue={user.role}
                                onValueChange={(val) => handleRoleChange(user.id, val)}
                                disabled={isUpdating === user.id || user.id === currentUserId}
                            >
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="sales">Sales</SelectItem>
                                    <SelectItem value="service">Service</SelectItem>
                                    <SelectItem value="viewer">Viewer</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
