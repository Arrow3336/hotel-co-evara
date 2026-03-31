import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { hotels } from "@/data/hotels";
import { ArrowLeft, Star, X, Waves, Sparkles, UtensilsCrossed, TreePalm, Dumbbell, Wine, Car, Phone, Wifi, ArrowRight, Mail, Instagram, Coffee, Gamepad2, ParkingCircle, Droplets, Scissors, Menu } from "lucide-react";
import constructionImg from "@/assets/construction-coming-soon.png";
import ElevatorTransition from "@/components/ElevatorTransition";
import { useElevatorNavigation } from "@/hooks/useElevatorNavigation";

const amenityIcons: Record<string, React.ReactNode> = {
  "Infinity Pool": <Waves className="w-4 h-4" />,
  "Cliffside Pool": <Waves className="w-4 h-4" />,
  "Natural Pool": <Waves className="w-4 h-4" />,
  "Swimming Pool": <Waves className="w-4 h-4" />,
  "Spa & Wellness": <Sparkles className="w-4 h-4" />,
  "Mediterranean Spa": <Sparkles className="w-4 h-4" />,
  "Luxury Spa": <Sparkles className="w-4 h-4" />,
  "Jungle Spa": <Sparkles className="w-4 h-4" />,
  "Spa & Salon": <Scissors className="w-4 h-4" />,
  "Fine Dining": <UtensilsCrossed className="w-4 h-4" />,
  "Gourmet Restaurant": <UtensilsCrossed className="w-4 h-4" />,
  "Michelin Restaurant": <UtensilsCrossed className="w-4 h-4" />,
  "Farm-to-Table Restaurant": <UtensilsCrossed className="w-4 h-4" />,
  "CHAUKAA Restaurant": <UtensilsCrossed className="w-4 h-4" />,
  "Multi-Cuisine Restaurant": <UtensilsCrossed className="w-4 h-4" />,
  "Coffee Shop": <Coffee className="w-4 h-4" />,
  "Private Beach": <TreePalm className="w-4 h-4" />,
  "Fitness Center": <Dumbbell className="w-4 h-4" />,
  "Wine Cellar": <Wine className="w-4 h-4" />,
  "Valet Parking": <Car className="w-4 h-4" />,
  "Car Parking": <ParkingCircle className="w-4 h-4" />,
  "Concierge": <Phone className="w-4 h-4" />,
  "Rain Dance Area": <Droplets className="w-4 h-4" />,
  "Kids Zone": <Gamepad2 className="w-4 h-4" />,
};

const toSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

const ParallaxImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className={`overflow-hidden ${className || ""}`}>
      <motion.img src={src} alt={alt} className="w-full h-[115%] object-cover" style={{ y }} loading="lazy" />
    </div>
  );
};

const HotelPage = () => {
  const { id } = useParams();
  const navigateTo = useNavigate();
  const { isTransitioning, navigateWithElevator, handleTransitionComplete, handleDoorsFullyClosed } = useElevatorNavigation();
  const hotel = hotels.find((h) => h.id === id);
  const [menuOpen, setMenuOpen] = useState(false);

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-display text-foreground" style={{ fontWeight: 300 }}>Hotel not found</h1>
          <button onClick={() => navigateWithElevator("/")} className="mt-4 text-muted-foreground underline font-body">Return home</button>
        </div>
      </div>
    );
  }

  const isComingSoon = hotel.id === "evara-exotica";

  if (isComingSoon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background section-padding text-center">
        <ElevatorTransition isActive={isTransitioning} onComplete={handleTransitionComplete} onDoorsFullyClosed={handleDoorsFullyClosed} />
        <img src={constructionImg} alt="Under Construction" className="w-56 md:w-72 mb-6 opacity-80" />
        <h1 className="text-3xl md:text-4xl font-display text-foreground" style={{ fontWeight: 300 }}>{hotel.name}</h1>
        <p className="text-muted-foreground font-body mt-2 text-base tracking-wider" style={{ fontWeight: 400 }}>Opening Soon</p>
        <button
          onClick={() => navigateWithElevator("/")}
          className="mt-8 group inline-flex items-center gap-2 border border-primary/30 text-primary px-7 py-2.5 text-[9px] tracking-[0.25em] uppercase font-body hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 rounded-full"
          style={{ fontWeight: 500 }}
        >
          Back to Home
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <ElevatorTransition isActive={isTransitioning} onComplete={handleTransitionComplete} onDoorsFullyClosed={handleDoorsFullyClosed} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between h-14">
          <button onClick={() => navigateWithElevator("/")} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] tracking-wider uppercase font-body hidden sm:inline" style={{ fontWeight: 400 }}>Back</span>
          </button>

          <div className="absolute left-1/2 -translate-x-1/2">
            <span className="text-sm tracking-[0.15em] uppercase font-display" style={{ fontWeight: 300 }}>{hotel.name}</span>
          </div>

          <div className="hidden md:flex items-center gap-5">
            <a href="#about" className="text-[9px] tracking-[0.12em] uppercase text-muted-foreground hover:text-primary transition-colors font-body" style={{ fontWeight: 400 }}>About</a>
            <a href="#highlights" className="text-[9px] tracking-[0.12em] uppercase text-muted-foreground hover:text-primary transition-colors font-body" style={{ fontWeight: 400 }}>Experience</a>
            <a href="#rooms" className="text-[9px] tracking-[0.12em] uppercase text-muted-foreground hover:text-primary transition-colors font-body" style={{ fontWeight: 400 }}>Rooms</a>
            <a href="#amenities" className="text-[9px] tracking-[0.12em] uppercase text-muted-foreground hover:text-primary transition-colors font-body" style={{ fontWeight: 400 }}>Amenities</a>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-foreground">
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="md:hidden overflow-hidden"
              style={{ background: "hsl(var(--background))", borderTop: "1px solid hsl(var(--border) / 0.4)" }}
            >
              <div className="px-8 py-6 flex flex-col gap-4">
                <span className="text-[8px] tracking-[0.4em] uppercase text-muted-foreground/40 font-body">Navigate</span>
                {[
                  { href: "#about", label: "About" },
                  { href: "#highlights", label: "Experience" },
                  { href: "#rooms", label: "Rooms & Suites" },
                  { href: "#amenities", label: "Amenities" },
                ].map((item, i) => (
                  <motion.a
                    key={i}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-foreground/60 hover:text-primary transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <span className="text-xs tracking-[0.15em] uppercase font-body" style={{ fontWeight: 400 }}>{item.label}</span>
                  </motion.a>
                ))}
                <div className="w-8 h-px bg-primary/20 mt-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero with parallax */}
      <section ref={heroRef} className="relative h-[65vh] md:h-[80vh] overflow-hidden">
        <motion.img src={hotel.heroImage} alt={hotel.name} className="w-full h-[120%] object-cover" style={{ y: heroY }} />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-14">
          <div className="flex gap-1 mb-2">
            {Array.from({ length: hotel.rating }).map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5 text-primary fill-primary" />
            ))}
          </div>
          <span className="text-[9px] tracking-[0.3em] uppercase text-primary-foreground/50 font-body" style={{ fontWeight: 400 }}>{hotel.tagline}</span>
          <h1 className="text-3xl md:text-5xl font-display text-primary-foreground mt-1 tracking-wide" style={{ fontWeight: 300 }}>{hotel.name}</h1>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section-padding max-w-3xl mx-auto text-center">
        <span className="text-[9px] tracking-[0.3em] uppercase text-primary/60 font-body" style={{ fontWeight: 400 }}>Welcome to</span>
        <h2 className="text-2xl md:text-4xl font-display mt-2 text-foreground tracking-wide" style={{ fontWeight: 300 }}>{hotel.name}</h2>
        <div className="gold-divider mt-3 mb-5" />
        <p className="text-muted-foreground font-body leading-relaxed text-sm" style={{ fontWeight: 400 }}>{hotel.description}</p>
      </section>

      {/* Highlights */}
      <section id="highlights" className="bg-secondary">
        {hotel.highlights.map((highlight, i) => (
          <div key={i} className="section-padding">
            <div className={`max-w-6xl mx-auto flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-14 items-center`}>
              <div className="flex-1 w-full">
                <ParallaxImage src={highlight.image} alt={highlight.title} className="rounded-2xl aspect-[4/3]" />
              </div>
              <div className="flex-1">
                <span className="text-[9px] tracking-[0.3em] uppercase text-primary/60 font-body" style={{ fontWeight: 400 }}>Experience</span>
                <h3 className="text-xl md:text-3xl font-display mt-1 text-foreground tracking-wide" style={{ fontWeight: 300 }}>{highlight.title}</h3>
                <div className="gold-divider-left mt-2 mb-3" />
                <p className="text-muted-foreground font-body leading-relaxed text-sm line-clamp-3" style={{ fontWeight: 400 }}>{highlight.description}</p>
                <button
                  onClick={() => navigateTo(`/hotel/${id}/${toSlug(highlight.title)}`)}
                  className="mt-5 group inline-flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase text-primary font-body hover:gap-3 transition-all"
                  style={{ fontWeight: 500 }}
                >
                  Learn More
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Gallery */}
      <section className="section-padding">
        <div className="text-center mb-10">
          <span className="text-[9px] tracking-[0.3em] uppercase text-primary/60 font-body" style={{ fontWeight: 400 }}>Gallery</span>
          <h3 className="text-xl md:text-3xl font-display mt-2 text-foreground tracking-wide" style={{ fontWeight: 300 }}>Moments & Emotions</h3>
          <div className="gold-divider mt-3" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 max-w-6xl mx-auto">
          {hotel.gallery.map((img, i) => (
            <img key={i} src={img} alt={`${hotel.name} gallery ${i + 1}`} className="w-full aspect-square object-cover rounded-xl hover:scale-[1.02] transition-transform duration-500" loading="lazy" />
          ))}
        </div>
      </section>

      {/* Rooms & Suites */}
      <section id="rooms" className="section-padding bg-secondary">
        <div className="text-center mb-12">
          <span className="text-[9px] tracking-[0.3em] uppercase text-primary/60 font-body" style={{ fontWeight: 400 }}>Accommodations</span>
          <h2 className="text-2xl md:text-4xl font-display mt-2 text-foreground tracking-wide" style={{ fontWeight: 300 }}>Rooms & Suites</h2>
          <div className="gold-divider mt-4" />
          <p className="text-sm text-muted-foreground font-body mt-4 max-w-md mx-auto leading-relaxed" style={{ fontWeight: 400 }}>
            Thoughtfully designed for comfort and elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {hotel.rooms.map((room, i) => (
            <motion.div
              key={i}
              className="group bg-card rounded-3xl overflow-hidden border border-border/20 transition-all duration-300"
              style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.03)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
            >
              <div className="relative overflow-hidden m-3 rounded-2xl">
                <img src={room.image} alt={room.name} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500 ease-out" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 rounded-xl px-3 py-1.5 backdrop-blur-lg" style={{
                  background: "hsl(var(--background) / 0.88)",
                  border: "1px solid hsl(var(--border) / 0.3)",
                }}>
                  <span className="text-sm font-display text-foreground" style={{ fontWeight: 400 }}>{room.price}</span>
                  <span className="text-[7px] text-muted-foreground font-body ml-1 uppercase tracking-widest">/night</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-base font-display text-background drop-shadow-md tracking-wide" style={{ fontWeight: 300 }}>{room.name}</h3>
                </div>
              </div>

              <div className="px-4 pb-4 pt-1.5">
                <p className="text-[11px] text-muted-foreground font-body leading-relaxed line-clamp-2" style={{ fontWeight: 400 }}>{room.description}</p>
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {room.features.slice(0, 3).map((f) => (
                    <span key={f} className="text-[7px] px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-primary/60 font-body tracking-widest uppercase" style={{ fontWeight: 400 }}>
                      {f}
                    </span>
                  ))}
                </div>
                <motion.button
                  className="mt-3 w-full py-2.5 rounded-xl text-[9px] tracking-[0.2em] uppercase font-body border border-foreground/10 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                  style={{ fontWeight: 500 }}
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
        <div className="text-center mb-10">
          <span className="text-[9px] tracking-[0.3em] uppercase text-primary/60 font-body" style={{ fontWeight: 400 }}>Experience</span>
          <h2 className="text-2xl md:text-3xl font-display mt-2 text-foreground tracking-wide" style={{ fontWeight: 300 }}>Amenities</h2>
          <div className="gold-divider mt-3" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {hotel.amenities.map((amenity, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center gap-1.5 p-4 glass-card rounded-xl hover-gold-border text-center transition-all duration-300"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <div className="text-primary/70">
                {amenityIcons[amenity] || <Wifi className="w-4 h-4" />}
              </div>
              <span className="text-[10px] text-muted-foreground font-body" style={{ fontWeight: 400 }}>{amenity}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-foreground text-center">
        <span className="text-[9px] tracking-[0.3em] uppercase text-primary/70 font-body" style={{ fontWeight: 400 }}>Ready to Experience</span>
        <h2 className="text-2xl md:text-3xl font-display mt-2 text-background tracking-wide" style={{ fontWeight: 300 }}>{hotel.name}</h2>
        <div className="gold-divider mt-3 mb-5" />
        <p className="text-background/40 font-body max-w-sm mx-auto text-sm" style={{ fontWeight: 400 }}>
          Reserve your stay and discover unparalleled luxury.
        </p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <a href="tel:+919031027961" className="px-8 py-2.5 bg-primary text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-body rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 inline-flex items-center gap-2" style={{ fontWeight: 500 }}>
            <Phone className="w-3 h-3" /> Reserve Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground border-t border-background/10">
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="text-base tracking-[0.25em] uppercase font-display text-background" style={{ fontWeight: 300 }}>EVARA Co.</span>
              <span className="text-[9px] tracking-[0.15em] uppercase text-primary/60 font-body" style={{ fontWeight: 400 }}>Luxury Hospitality</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-[9px] tracking-[0.2em] uppercase text-background/30 font-body mb-1" style={{ fontWeight: 400 }}>Quick Links</span>
              <a href="#about" className="text-[10px] text-background/40 hover:text-primary transition-colors font-body" style={{ fontWeight: 400 }}>About</a>
              <a href="#rooms" className="text-[10px] text-background/40 hover:text-primary transition-colors font-body" style={{ fontWeight: 400 }}>Rooms & Suites</a>
              <a href="#amenities" className="text-[10px] text-background/40 hover:text-primary transition-colors font-body" style={{ fontWeight: 400 }}>Amenities</a>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <span className="text-[9px] tracking-[0.2em] uppercase text-background/30 font-body mb-1" style={{ fontWeight: 400 }}>Connect</span>
              <div className="flex gap-3">
                {[
                  { href: "https://instagram.com", icon: Instagram, external: true },
                  { href: "mailto:info@hotelevara.in", icon: Mail },
                  { href: "tel:+919031027961", icon: Phone },
                ].map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="w-8 h-8 rounded-full border border-background/10 flex items-center justify-center text-background/30 hover:text-primary hover:border-primary transition-all duration-300"
                  >
                    <link.icon className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-background/10 text-center">
            <p className="text-[9px] text-background/25 font-body" style={{ fontWeight: 400 }}>© 2025 EVARA Co. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HotelPage;
