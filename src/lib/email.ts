import { Resend } from "resend";
import { LeadNotificationEmail } from "@/components/email/lead-notification";

export async function sendLeadNotification(data: {
    leadName: string;
    leadEmail: string;
    leadPhone: string;
    leadMessage: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: number;
    vehicleId: string;
}) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Email notification skipped.");
        return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        await resend.emails.send({
            from: "Prestige Motors <onboarding@resend.dev>", // Default Resend testing domain
            to: ["delivered@resend.dev"], // Default Resend testing email, change to dealer email in prod
            subject: `New Lead: ${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}`,
            react: LeadNotificationEmail(data),
        });
        console.log("Lead notification email sent successfully.");
    } catch (error) {
        console.error("Failed to send lead notification email:", error);
        // Don't throw error to prevent blocking the lead creation flow
    }
}
