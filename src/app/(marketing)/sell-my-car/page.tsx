// import { Navbar } from "@/components/layout/navbar";
import { SellCarForm } from "@/components/services/sell-car-form";

export default function SellMyCarPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
            {/* Navbar handled in global layout */}
            <div className="flex-1 container pt-24 pb-12 md:pt-32 md:pb-20 px-4 md:px-6">
                <div className="max-w-3xl mx-auto mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-white tracking-tight">
                        Sell Your <span className="text-primary">Car</span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed">
                        Get the best value for your luxury vehicle. We offer a seamless consignment process, handling everything from marketing to paperwork.
                    </p>
                </div>

                <SellCarForm />
            </div>
        </div>
    );
}
