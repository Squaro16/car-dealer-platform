import { redirect } from "next/navigation";

export default function CarsAvailablePage() {
    redirect("/inventory?status=available");
}
