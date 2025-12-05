import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFeaturedCars } from "@/lib/actions/vehicles";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default async function Home() {
  const featuredCars = await getFeaturedCars();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2583&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Find Your Dream Car <br />
              <span className="text-blue-400">Without the Hassle</span>
            </h1>
            <p className="text-lg text-slate-300">
              Premium selection of new and used vehicles. Transparent pricing,
              comprehensive inspections, and flexible financing options.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/inventory">
                <Button size="lg" className="text-base bg-blue-600 hover:bg-blue-700 text-white border-none">
                  View Inventory <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-base bg-transparent border-white text-white hover:bg-white hover:text-slate-900">
                  Book Test Drive
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 bg-slate-50 border-b">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">150+ Point Inspection</h3>
                <p className="text-sm text-muted-foreground">Every car is rigorously tested</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Transparent Pricing</h3>
                <p className="text-sm text-muted-foreground">No hidden fees or surprises</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Flexible Financing</h3>
                <p className="text-sm text-muted-foreground">Low rates and easy approval</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Vehicles</h2>
              <p className="text-muted-foreground mt-2">Hand-picked selections just for you</p>
            </div>
            <Link href="/inventory">
              <Button variant="ghost">View All Cars <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCars.map((car) => (
              <Card key={car.id} className="overflow-hidden group">
                <div className="aspect-[16/10] bg-slate-100 relative">
                  {car.images && Array.isArray(car.images) && car.images.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={car.images[0] as string}
                      alt={`${car.year} ${car.make} ${car.model}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-slate-200">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur">
                      {car.condition}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="line-clamp-1 text-lg">
                    {car.year} {car.make} {car.model}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{car.variant}</p>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-between text-sm">
                    <span>{Number(car.mileage).toLocaleString()} km</span>
                    <span>{car.transmission}</span>
                  </div>
                  <div className="mt-4 text-xl font-bold text-primary">
                    ${Number(car.price).toLocaleString()}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Link href={`/inventory/${car.id}`} className="w-full">
                    <Button className="w-full" variant="outline">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
