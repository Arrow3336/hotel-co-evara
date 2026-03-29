import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { hotels } from "@/data/hotels";
import { ArrowLeft, Star, MapPin, X, Waves, Sparkles, UtensilsCrossed, TreePalm, Dumbbell, Wine, Car, Phone, Wifi, ArrowRight, Mail, Instagram, Coffee, Gamepad2, ParkingCircle, Droplets, Scissors, Hotel } from "lucide-react";
import constructionImg from "@/assets/construction-coming-soon.png";
import ElevatorTransition from "@/components/ElevatorTransition";
import { useElevatorNavigation } from "@/hooks/useElevatorNavigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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

// Section background patterns as subtle SVG vectors
const sectionPatterns: Record<string, string> = {
  restaurant: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5v20M25 5v8M35 5v8M30 35c0 11-5 20-5 20h10s-5-9-5-20z' stroke='%23c8a96e' stroke-width='0.5' fill='none' opacity='0.06'/%3E%3C/svg%3E")`,
  banquet: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='20' stroke='%23c8a96e' stroke-width='0.5' fill='none' opacity='0.05'/%3E%3Ccircle cx='40' cy='40' r='30' stroke='%23c8a96e' stroke-width='0.3' fill='none' opacity='0.04'/%3E%3C/svg%3E")`,
  rooftop: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 90 L50 10 L90 90' stroke='%23c8a96e' stroke-width='0.4' fill='none' opacity='0.04'/%3E%3C/svg%3E")`,
  rooms: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='10' y='15' width='40' height='30' rx='3' stroke='%23c8a96e' stroke-width='0.4' fill='none' opacity='0.05'/%3E%3C/svg%3E")`,
};

const getPatternForHighlight = (title: string): string => {
  const t = title.toLowerCase();
  if (t.includes("restaurant") || t.includes("dining") || t.includes("cuisine")) return sectionPatterns.restaurant;
  if (t.includes("banquet") || t.includes("hall") || t.includes("lawn")) return sectionPatterns.banquet;
  if (t.includes("rooftop") || t.includes("club") || t.includes("leisure")) return sectionPatterns.rooftop;
  return sectionPatterns.rooms;
};

const HotelPage = () => {
  const { id } = useParams();
  const { isTransitioning, navigateWithElevator, handleTransitionComplete } = useElevatorNavigation();
  const navigate = navigateWithElevator;
  const hotel = hotels.find((h) => h.id === id);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<number | null>(null);

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
          className="mt-10 group inline-flex items-center gap-3 border border-primary/30 text-primary px-8 py-3 text-[10px] tracking-[0.3em] uppercase font-body hover:bg-primary/5 hover:border-primary/60 transition-all duration-500 rounded-full"
        >
          Back to Home
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <ElevatorTransition isActive={isTransitioning} onComplete={handleTransitionComplete} />

      {/* Navigation — Centered Logo, Hotel Icon */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-5 md:px-12 flex items-center justify-between h-16">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs tracking-wider uppercase font-body hidden sm:inline">Back</span>
          </button>

          {/* Center Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <span className="text-lg tracking-[0.2em] uppercase font-display font-semibold">{hotel.name}</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#about" className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors font-body">About</a>
            <a href="#highlights" className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors font-body">Experience</a>
            <a href="#rooms" className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors font-body">Rooms</a>
            <a href="#amenities" className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors font-body">Amenities</a>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-foreground">
            {menuOpen ? <X className="w-5 h-5" /> : <Hotel className="w-5 h-5 text-primary" />}
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

      {/* Hero — No address on image */}
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
        </div>
      </section>

      {/* Address bar — separate from hero */}
      <div className="bg-secondary border-b border-border">
        <div className="max-w-6xl mx-auto px-5 md:px-12 py-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[12px] text-muted-foreground font-body flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            {hotel.address}, {hotel.city}
          </p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(hotel.address + ", " + hotel.city)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-[0.2em] uppercase text-primary font-body hover:underline"
          >
            View on Map →
          </a>
        </div>
      </div>

      {/* About */}
      <section id="about" className="section-padding max-w-4xl mx-auto text-center">
        <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-body">Welcome to</span>
        <h2 className="text-3xl md:text-4xl font-display mt-2 text-foreground">{hotel.name}</h2>
        <div className="gold-divider mt-4 mb-6" />
        <p className="text-muted-foreground font-body leading-relaxed">{hotel.description}</p>
      </section>

      {/* Highlights — with background patterns and Learn More popup */}
      <section id="highlights" className="bg-secondary">
        {hotel.highlights.map((highlight, i) => (
          <div
            key={i}
            className="section-padding relative overflow-hidden"
            style={{ backgroundImage: getPatternForHighlight(highlight.title), backgroundRepeat: "repeat" }}
          >
            <div className={`max-w-6xl mx-auto flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}>
              <div className="flex-1">
                <img src={highlight.image} alt={highlight.title} className="w-full aspect-[4/3] object-cover rounded-2xl" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-body">Experience</span>
                <h3 className="text-2xl md:text-3xl font-display mt-2 text-foreground">{highlight.title}</h3>
                <div className="gold-divider-left mt-3 mb-4" />
                <p className="text-muted-foreground font-body leading-relaxed line-clamp-3">{highlight.description}</p>
                <button
                  onClick={() => setSelectedHighlight(i)}
                  className="mt-6 group inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-primary font-body hover:gap-3 transition-all"
                >
                  Learn More
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Learn More Dialog */}
      <Dialog open={selectedHighlight !== null} onOpenChange={(open) => !open && setSelectedHighlight(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedHighlight !== null && hotel.highlights[selectedHighlight] && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-display">{hotel.highlights[selectedHighlight].title}</DialogTitle>
                <DialogDescription className="text-[10px] tracking-[0.3em] uppercase text-primary">
                  {hotel.name} — Experience
                </DialogDescription>
              </DialogHeader>
              <img
                src={hotel.highlights[selectedHighlight].image}
                alt={hotel.highlights[selectedHighlight].title}
                className="w-full aspect-video object-cover rounded-xl mt-4"
              />
              <p className="text-muted-foreground font-body leading-relaxed mt-4">
                {hotel.highlights[selectedHighlight].description}
              </p>
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-[11px] text-muted-foreground font-body">
                  For reservations and inquiries, please contact us at{" "}
                  <a href="tel:+919876543210" className="text-primary hover:underline">+91 98765 43210</a>
                  {" "}or email{" "}
                  <a href="mailto:info@evaraco.com" className="text-primary hover:underline">info@evaraco.com</a>
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Gallery */}
      <section className="section-padding">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-body">Gallery</span>
          <h3 className="text-2xl md:text-3xl font-display mt-2 text-foreground">Moments & Emotions</h3>
          <div className="gold-divider mt-4" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-6xl mx-auto">
          {hotel.gallery.map((img, i) => (
            <img key={i} src={img} alt={`${hotel.name} gallery ${i + 1}`} className="w-full aspect-square object-cover rounded-xl hover:scale-[1.02] transition-transform duration-500" loading="lazy" />
          ))}
        </div>
      </section>

      {/* Rooms & Suites — Professional Curved Cards */}
      <section id="rooms" className="section-padding bg-secondary" style={{ backgroundImage: sectionPatterns.rooms, backgroundRepeat: "repeat" }}>
        <div className="text-center mb-16">
          <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-body">Accommodations</span>
          <h2 className="text-3xl md:text-5xl font-display mt-3 text-foreground font-light">Rooms & Suites</h2>
          <div className="gold-divider mt-5" />
          <p className="text-sm text-muted-foreground font-body mt-5 max-w-lg mx-auto leading-relaxed">
            Each room is thoughtfully designed to offer an exceptional blend of comfort and elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {hotel.rooms.map((room, i) => (
            <motion.div
              key={i}
              className="group relative bg-card rounded-3xl overflow-hidden border border-border/20 transition-all duration-500"
              style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              whileHover={{
                y: -8,
                boxShadow: "0 20px 50px rgba(0,0,0,0.1), 0 4px 16px hsl(38 70% 45% / 0.1)",
              }}
            >
              {/* Image container with inner rounding */}
              <div className="relative overflow-hidden m-3 rounded-2xl">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />

                {/* Price badge */}
                <div className="absolute top-3 right-3 rounded-2xl px-4 py-2 backdrop-blur-xl" style={{
                  background: "hsl(var(--background) / 0.9)",
                  border: "1px solid hsl(var(--border) / 0.5)",
                }}>
                  <span className="text-base font-display font-bold text-foreground leading-none">{room.price}</span>
                  <span className="text-[7px] text-muted-foreground font-body ml-1 uppercase tracking-widest">/night</span>
                </div>

                {/* Room name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-display text-background font-medium drop-shadow-lg">{room.name}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="px-5 pb-5 pt-2">
                <p className="text-[12px] text-muted-foreground font-body leading-relaxed line-clamp-2">{room.description}</p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {room.features.slice(0, 3).map((f) => (
                    <span
                      key={f}
                      className="text-[8px] px-2.5 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary/80 font-body tracking-widest uppercase"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* Reserve button */}
                <motion.button
                  className="mt-4 w-full py-3 rounded-xl text-[10px] tracking-[0.25em] uppercase font-display font-semibold
                  border border-foreground/10 text-foreground
                  hover:bg-primary hover:text-primary-foreground hover:border-primary
                  transition-all duration-400 active:scale-[0.97]"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Reserve Now
                </motion.button>
              </div>
            </motion.div>
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
            <motion.div
              key={i}
              className="flex flex-col items-center gap-2 p-5 glass-card rounded-2xl hover-gold-border text-center transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <div className="text-primary">
                {amenityIcons[amenity] || <Wifi className="w-5 h-5" />}
              </div>
              <span className="text-[11px] text-muted-foreground font-body">{amenity}</span>
            </motion.div>
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
        <button className="mt-8 px-10 py-3 bg-primary text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-body rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
          Reserve Your Stay
        </button>
      </section>

      {/* Footer — Professional */}
      <footer className="bg-foreground border-t border-background/10">
        <div className="max-w-6xl mx-auto px-5 md:px-12 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="text-xl tracking-[0.3em] uppercase font-display font-medium text-background">EVARACo.</span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-primary font-body">Luxury Hospitality</span>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-[10px] tracking-[0.3em] uppercase text-background/40 font-body mb-1">Quick Links</span>
              <a href="#about" className="text-[11px] text-background/60 hover:text-primary transition-colors font-body">About</a>
              <a href="#rooms" className="text-[11px] text-background/60 hover:text-primary transition-colors font-body">Rooms & Suites</a>
              <a href="#amenities" className="text-[11px] text-background/60 hover:text-primary transition-colors font-body">Amenities</a>
            </div>

            {/* Social */}
            <div className="flex flex-col items-center md:items-end gap-3">
              <span className="text-[10px] tracking-[0.3em] uppercase text-background/40 font-body mb-1">Connect</span>
              <div className="flex gap-4">
                {[
                  { href: "https://instagram.com", icon: Instagram, external: true },
                  { href: "mailto:info@evaraco.com", icon: Mail },
                  { href: "tel:+919876543210", icon: Phone },
                ].map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="w-9 h-9 rounded-full border border-background/20 flex items-center justify-center text-background/50 hover:text-primary hover:border-primary transition-all duration-300"
                  >
                    <link.icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-background/10 text-center">
            <p className="text-[10px] text-background/40 font-body">© 2025 EVARACo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HotelPage;
