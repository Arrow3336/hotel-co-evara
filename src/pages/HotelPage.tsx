import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { hotels } from "@/data/hotels";
import { ArrowLeft, Star, MapPin, Menu, X, Waves, Sparkles, UtensilsCrossed, TreePalm, Dumbbell, Wine, Car, Phone, Wifi, ArrowRight, Mail, Instagram, Coffee, Gamepad2, ParkingCircle, Droplets, Scissors } from "lucide-react";
import constructionImg from "@/assets/construction-coming-soon.png";
import ElevatorTransition from "@/components/ElevatorTransition";
import { useElevatorNavigation } from "@/hooks/useElevatorNavigation";

const amenityIcons: Record<string, React.ReactNode> = {
  "Infinity Pool": <Waves className="w-5 h-5" />,
  "Cliffside Pool": <Waves className="w-5 h-5" />,
  "Natural Pool": <Waves className="w-5 h-5" />,
  "Swimming Pool": <Waves className="w-5 h-5" />,
  "Spa & Wellness": <Sparkles className="w-5 h-5" />,
  "Mediterranean Spa": <Sparkles className="w-5 h-5" />,
  "Luxury Spa": <Sparkles className="w-5 h-5" />,
  "Jungle Spa": <Sparkles className="w-5 h-5" />,
  "Spa & Salon": <Scissors className="w-5 h-5" />,
  "Fine Dining": <UtensilsCrossed className="w-5 h-5" />,
  "Gourmet Restaurant": <UtensilsCrossed className="w-5 h-5" />,
  "Michelin Restaurant": <UtensilsCrossed className="w-5 h-5" />,
  "Farm-to-Table Restaurant": <UtensilsCrossed className="w-5 h-5" />,
  "CHAUKAA Restaurant": <UtensilsCrossed className="w-5 h-5" />,
  "Multi-Cuisine Restaurant": <UtensilsCrossed className="w-5 h-5" />,
  "Coffee Shop": <Coffee className="w-5 h-5" />,
  "Private Beach": <TreePalm className="w-5 h-5" />,
  "Fitness Center": <Dumbbell className="w-5 h-5" />,
  "Wine Cellar": <Wine className="w-5 h-5" />,
  "Valet Parking": <Car className="w-5 h-5" />,
  "Car Parking": <ParkingCircle className="w-5 h-5" />,
  "Concierge": <Phone className="w-5 h-5" />,
  "Rain Dance Area": <Droplets className="w-5 h-5" />,
  "Kids Zone": <Gamepad2 className="w-5 h-5" />,
};

const HotelPage = () => {
  const { id } = useParams();
  const { isTransitioning, navigateWithElevator, handleTransitionComplete } = useElevatorNavigation();
  const navigate = navigateWithElevator;
  const hotel = hotels.find((h) => h.id === id);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-display text-foreground">Hotel not found</h1>
          <button onClick={() => navigate("/")} className="mt-4 text-muted-foreground underline font-body">Return home</button>
        </div>
      </div>
    );
  }

  const isComingSoon = hotel.id === "evara-exotica";

  if (isComingSoon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background section-padding text-center">
        <ElevatorTransition isActive={isTransitioning} onComplete={handleTransitionComplete} />
        <img src={constructionImg} alt="Under Construction" className="w-64 md:w-80 mb-8 opacity-80" />
        <h1 className="text-4xl md:text-5xl font-display text-foreground">{hotel.name}</h1>
        <p className="text-muted-foreground font-body mt-3 text-lg tracking-wider">Opening Soon……….. </p>
        <button
          onClick={() => navigate("/")}
          className="mt-10 group inline-flex items-center gap-3 border border-primary/30 text-primary px-8 py-3 text-[10px] tracking-[0.3em] uppercase font-body hover:bg-primary/5 hover:border-primary/60 transition-all duration-500"
        >
          Back to Home
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {/* Elevator Transition */}
      <ElevatorTransition isActive={isTransitioning} onComplete={handleTransitionComplete} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-5 md:px-12 flex items-center justify-between h-16">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-lg tracking-[0.2em] uppercase font-display font-semibold">EVARACo.</span>
          </button>
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-xs tracking-wider text-muted-foreground hover:text-primary transition-colors font-body">About</a>
            <a href="#highlights" className="text-xs tracking-wider text-muted-foreground hover:text-primary transition-colors font-body">Experience</a>
            <a href="#rooms" className="text-xs tracking-wider text-muted-foreground hover:text-primary transition-colors font-body">Rooms</a>
            <a href="#amenities" className="text-xs tracking-wider text-muted-foreground hover:text-primary transition-colors font-body">Amenities</a>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-foreground">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border bg-background overflow-hidden"
            >
              <div className="px-5 py-4 flex flex-col gap-3">
                <a href="#about" onClick={() => setMenuOpen(false)} className="text-xs tracking-wider text-muted-foreground font-body">About</a>
                <a href="#highlights" onClick={() => setMenuOpen(false)} className="text-xs tracking-wider text-muted-foreground font-body">Experience</a>
                <a href="#rooms" onClick={() => setMenuOpen(false)} className="text-xs tracking-wider text-muted-foreground font-body">Rooms</a>
                <a href="#amenities" onClick={() => setMenuOpen(false)} className="text-xs tracking-wider text-muted-foreground font-body">Amenities</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <img src={hotel.heroImage} alt={hotel.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="flex gap-1 mb-3">
            {Array.from({ length: hotel.rating }).map((_, i) => (
              <Star key={i} className="w-3 h-3 text-primary fill-primary" />
            ))}
          </div>
          <span className="text-[10px] tracking-[0.4em] uppercase text-primary-foreground/70 font-body">
            {hotel.tagline}
          </span>
          <h1 className="text-4xl md:text-6xl font-display text-primary-foreground mt-2">{hotel.name}</h1>
          <p className="text-sm text-primary-foreground/60 font-body mt-2 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {hotel.address}, {hotel.city}
          </p>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section-padding max-w-4xl mx-auto text-center">
        <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-body">Welcome to</span>
        <h2 className="text-3xl md:text-4xl font-display mt-2 text-foreground">{hotel.name}</h2>
        <div className="gold-divider mt-4 mb-6" />
        <p className="text-muted-foreground font-body leading-relaxed">{hotel.description}</p>
      </section>

      {/* Highlights */}
      <section id="highlights" className="section-padding bg-secondary">
        {hotel.highlights.map((highlight, i) => (
          <div key={i} className={`max-w-6xl mx-auto flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center mb-16 last:mb-0`}>
            <div className="flex-1">
              <img src={highlight.image} alt={highlight.title} className="w-full aspect-[4/3] object-cover" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-body">Experience</span>
              <h3 className="text-2xl md:text-3xl font-display mt-2 text-foreground">{highlight.title}</h3>
              <div className="gold-divider-left mt-3 mb-4" />
              <p className="text-muted-foreground font-body leading-relaxed">{highlight.description}</p>
              <button className="mt-6 group inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-primary font-body hover:gap-3 transition-all">
                Learn More
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Gallery */}
      <section className="section-padding">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-body">Gallery</span>
          <h3 className="text-2xl md:text-3xl font-display mt-2 text-foreground">Moments & Emotions</h3>
          <div className="gold-divider mt-4" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-6xl mx-auto">
          {hotel.gallery.map((img, i) => (
            <img key={i} src={img} alt={`${hotel.name} gallery ${i + 1}`} className="w-full aspect-square object-cover hover:scale-[1.02] transition-transform duration-500" />
          ))}
        </div>
      </section>

      {/* Rooms & Pricing */}
      <section id="rooms" className="section-padding bg-secondary">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-body">Accommodations</span>
          <h2 className="text-3xl md:text-4xl font-display mt-2 text-foreground">Rooms & Suites</h2>
          <div className="gold-divider mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {hotel.rooms.map((room, i) => (
            <div key={i} className="glass-card hover-gold-border overflow-hidden">
              <div className="relative">
                <img src={room.image} alt={room.name} className="w-full aspect-[4/3] object-cover" />
                <div className="absolute top-3 right-3 bg-foreground/80 text-background px-3 py-1 text-xs font-body">
                  {room.price}<span className="text-background/60 text-[10px]">/night</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-display text-foreground">{room.name}</h3>
                <p className="text-sm text-muted-foreground font-body mt-2 leading-relaxed">{room.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {room.features.map((f) => (
                    <span key={f} className="text-[10px] px-2 py-1 bg-muted text-muted-foreground font-body">
                      {f}
                    </span>
                  ))}
                </div>
                <button className="mt-5 w-full py-2.5 bg-primary text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-body hover:bg-gold-dark transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Amenities */}
      <section id="amenities" className="section-padding">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-body">Experience</span>
          <h2 className="text-3xl md:text-4xl font-display mt-2 text-foreground">Amenities</h2>
          <div className="gold-divider mt-4" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {hotel.amenities.map((amenity, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-4 glass-card hover-gold-border text-center">
              <div className="text-primary">
                {amenityIcons[amenity] || <Wifi className="w-5 h-5" />}
              </div>
              <span className="text-[11px] text-muted-foreground font-body">{amenity}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-foreground text-center">
        <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-body">Ready to Experience</span>
        <h2 className="text-3xl md:text-4xl font-display mt-2 text-background">{hotel.name}</h2>
        <div className="gold-divider mt-4 mb-6" />
        <p className="text-background/60 font-body max-w-md mx-auto">
          Reserve your stay and discover a world of unparalleled luxury and personalized service.
        </p>
        <button className="mt-8 px-10 py-3 bg-primary text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-body hover:bg-gold-dark transition-colors">
          Reserve Your Stay
        </button>
      </section>

      {/* Footer */}
      <footer className="section-padding bg-foreground text-background border-t border-background/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-sm tracking-[0.2em] uppercase font-display">EVARACo.</span>
          <p className="text-[11px] text-background/50 font-body">© 2025 EVARACo. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-background/50 hover:text-background transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="mailto:info@evaraco.com" className="text-background/50 hover:text-background transition-colors">
              <Mail className="w-4 h-4" />
            </a>
            <a href="tel:+919876543210" className="text-background/50 hover:text-background transition-colors">
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HotelPage;
