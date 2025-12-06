import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, Star, Shield, Zap, Car, FileText, Repeat, DollarSign, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getFeaturedCars } from "@/lib/actions/vehicles";

export default async function Home() {
  const featuredCars = await getFeaturedCars();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-body selection:bg-primary selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="/hero-background.png"
          >
            {/* Placeholder video - Night City Drive */}
            <source src="https://cdn.coverr.co/videos/coverr-night-driving-in-the-city-2569/1080p.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />

        <div className="container relative z-20 px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="font-heading text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter text-white mb-6 uppercase animate-in fade-in slide-in-from-bottom-8 duration-1000">
              First <span className="text-primary">Class</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-100 mb-8 font-light tracking-wide animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Experience the pinnacle of automotive engineering.
            </p>
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <Link href="/inventory">
                <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-white rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25">
                  Explore Collection <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Strip */}
      <div className="py-12 border-b border-white/5 bg-background">
        <div className="container px-4">
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
            {[
              { name: 'Ferrari', logo: 'https://pngimg.com/uploads/ferrari/ferrari_PNG102806.png', invert: false },
              { name: 'Lamborghini', logo: 'https://pngimg.com/uploads/lamborghini/lamborghini_PNG10709.png', invert: false },
              { name: 'Porsche', logo: 'https://pngimg.com/uploads/porsche_logo/porsche_logo_PNG1.png', invert: false },
              { name: 'Rolls Royce', logo: 'https://pngimg.com/uploads/rolls_royce/rolls_royce_PNG36.png', invert: false },
              { name: 'Bugatti', logo: 'https://pngimg.com/uploads/bugatti_logo/bugatti_logo_PNG8.png', invert: false },
              { name: 'McLaren', logo: 'https://pngimg.com/uploads/Mclaren/Mclaren_PNG40.png', invert: true }
            ].map((brand) => (
              <div key={brand.name} className="relative h-12 w-24 md:h-16 md:w-32 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className={`w-full h-full object-contain ${brand.invert ? 'brightness-0 invert' : ''}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Collection */}
      <section className="py-16 md:py-32 bg-background">
        <div className="container px-4">
          <div className="flex items-end justify-between mb-16">
            <div>
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">The Collection</span>
              <h2 className="font-heading text-4xl md:text-6xl font-bold text-white">Latest Arrivals</h2>
            </div>
            <Link href="/inventory" className="hidden md:flex items-center text-white hover:text-primary transition-colors group">
              View Full Inventory <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <Link href={`/inventory/${car.id}`} key={car.id} className="group relative block aspect-[4/3] bg-card overflow-hidden rounded-sm hover:-translate-y-2 transition-transform duration-500 ease-out">
                {Array.isArray(car.images) && car.images.length > 0 && typeof car.images[0] === 'string' ? (
                  <Image
                    src={car.images[0]}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-400">No Image</div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center space-x-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <span className="bg-primary px-2 py-0.5 text-xs font-bold text-white uppercase tracking-wider rounded-sm">
                      {car.condition}
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                    {car.year} {car.make} {car.model}
                  </h3>
                  <p className="text-gray-300 font-light mb-4">{Number(car.mileage).toLocaleString()} km • {car.transmission}</p>
                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-xl font-bold text-white">${Number(car.price).toLocaleString()}</span>
                    <span className="text-sm text-gray-300 uppercase tracking-wider group-hover:text-white transition-colors flex items-center">
                      View Details <ArrowRight className="ml-2 h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center md:hidden">
            <Link href="/inventory">
              <Button variant="outline" size="lg" className="w-full border-white text-white">View All Inventory</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services/Trust Section Redesigned */}
      <section className="py-16 md:py-24 bg-neutral-950 border-t border-white/5">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="space-y-4">
              <Star className="h-10 w-10 text-primary mx-auto md:mx-0" />
              <h3 className="font-heading text-2xl font-bold text-white">Global Sourcing</h3>
              <p className="text-gray-300 leading-relaxed">We locate rare and exclusive vehicles from around the world, ensuring you get exactly what you desire.</p>
            </div>
            <div className="space-y-4">
              <Star className="h-10 w-10 text-primary mx-auto md:mx-0" />
              <h3 className="font-heading text-2xl font-bold text-white">Premium Service</h3>
              <p className="text-gray-300 leading-relaxed">From white-glove delivery to comprehensive detailing, our service extends far beyond the sale.</p>
            </div>
            <div className="space-y-4">
              <Star className="h-10 w-10 text-primary mx-auto md:mx-0" />
              <h3 className="font-heading text-2xl font-bold text-white">Guaranteed Quality</h3>
              <p className="text-gray-300 leading-relaxed">Every vehicle undergoes a rigorous 150-point inspection to ensure pristine condition and performance.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
