import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { hotels } from "@/data/hotels";
import { Phone, Mail, Instagram, Menu, X, MapPin, ArrowRight, Star, Hotel } from "lucide-react";
import ElevatorTransition from "@/components/ElevatorTransition";
import { useElevatorNavigation } from "@/hooks/useElevatorNavigation";

const Index = () => {
  const { isTransitioning, navigateWithElevator, handleTransitionComplete } = useElevatorNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.18, delayChildren: 0.2 } },
  } as const;

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body overflow-x-hidden">
      <ElevatorTransition isActive={isTransitioning} onComplete={handleTransitionComplete} />

      {/* Intro Animation */}
      <AnimatePresence mode="wait">
        {!introComplete && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div className="flex flex-col items-center gap-3 z-10">
              <motion.span
                className="text-3xl md:text-5xl tracking-[0.5em] uppercase font-display text-foreground font-light"
                initial={{ opacity: 0, y: 10, letterSpacing: "0.8em" }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [10, 0, 0, -5],
                  letterSpacing: ["0.8em", "0.5em", "0.5em", "0.5em"],
                }}
                transition={{ duration: 2, times: [0, 0.25, 0.75, 1], ease: "easeInOut" }}
                onAnimationComplete={() => setIntroComplete(true)}
              >
                EVARACo.
              </motion.span>
              <motion.div
                className="gold-divider"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2, times: [0, 0.3, 0.7, 1], ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation — Centered Logo with Hotel Icon */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 glass-nav"
        initial={{ y: -80 }}
        animate={introComplete ? { y: 0 } : { y: -80 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-12 flex items-center justify-between h-16">
          {/* Left: Mobile menu / Desktop links */}
          <div className="flex items-center gap-6">
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-foreground p-1">
              {menuOpen ? <X className="w-5 h-5" /> : <Hotel className="w-5 h-5 text-primary" />}
            </button>
            <div className="hidden md:flex items-center gap-6">
              <a href="tel:+919876543210" className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors font-body flex items-center gap-1.5">
                <Phone className="w-3 h-3" /> Contact
              </a>
              <a href="mailto:info@evaraco.com" className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors font-body flex items-center gap-1.5">
                <Mail className="w-3 h-3" /> Email
              </a>
            </div>
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="text-lg tracking-[0.25em] uppercase font-display text-foreground font-semibold">
              EVARACo.
            </span>
          </div>

          {/* Right: Social */}
          <div className="hidden md:flex items-center gap-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors font-body flex items-center gap-1.5">
              <Instagram className="w-3 h-3" /> Follow
            </a>
          </div>
          <div className="md:hidden w-5" /> {/* Spacer for mobile */}
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden border-t border-border bg-background overflow-hidden"
            >
              <div className="px-5 py-4 flex flex-col gap-4">
                <a href="tel:+919876543210" className="text-xs tracking-wider text-muted-foreground font-body flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> Contact
                </a>
                <a href="mailto:info@evaraco.com" className="text-xs tracking-wider text-muted-foreground font-body flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Email
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-xs tracking-wider text-muted-foreground font-body flex items-center gap-2">
                  <Instagram className="w-3.5 h-3.5" /> Follow
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Properties Section — Full Page, No Borders */}
      <main className="pt-24 pb-20 section-padding">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={introComplete ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-px bg-primary/50" />
            <span className="text-[10px] tracking-[0.5em] uppercase text-primary font-body">Portfolio</span>
            <div className="w-10 h-px bg-primary/50" />
          </div>
          <h1 className="text-3xl md:text-5xl font-display text-foreground font-light">Our Properties</h1>
          <p className="text-sm text-muted-foreground font-body mt-4 max-w-md mx-auto leading-relaxed">
            Discover our collection of distinguished properties crafted for extraordinary experiences.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col gap-20 max-w-6xl mx-auto"
          variants={stagger}
          initial="hidden"
          animate={introComplete ? "show" : "hidden"}
        >
          {hotels.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              variants={fadeUp}
              className="cursor-pointer group"
              onClick={() => navigateWithElevator(`/hotel/${hotel.id}`)}
            >
              <div className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-14 items-center`}>
                {/* Image — no border, no box */}
                <div className="flex-1 w-full relative overflow-hidden rounded-3xl">
                  <motion.div
                    className="relative overflow-hidden rounded-3xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <img
                      src={hotel.cardImage}
                      alt={hotel.name}
                      className="w-full aspect-[4/3] object-cover rounded-3xl"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                </div>

                {/* Details */}
                <div className="flex-1 w-full flex flex-col justify-center py-4">
                  <div className="flex items-center gap-2 mb-3">
                    {Array.from({ length: hotel.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-primary fill-primary" />
                    ))}
                  </div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-primary/70 font-body">{hotel.tagline}</span>
                  <h2 className="text-2xl md:text-4xl font-display text-foreground font-light mt-1">{hotel.name}</h2>
                  <div className="gold-divider-left mt-4 mb-5" />
                  <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-3">
                    {hotel.description}
                  </p>
                  <p className="text-[11px] text-muted-foreground/70 font-body mt-3 flex items-start gap-1">
                    <MapPin className="w-3 h-3 mt-0.5 shrink-0 text-primary/60" />
                    <span className="line-clamp-1">{hotel.address}</span>
                  </p>
                  <motion.span
                    className="mt-6 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-primary font-body font-medium group-hover:gap-3 transition-all duration-300 self-start"
                    whileHover={{ x: 4 }}
                  >
                    Explore Property <ArrowRight className="w-3 h-3" />
                  </motion.span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer — Professional */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-5 md:px-12 py-12 md:py-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="text-xl tracking-[0.3em] uppercase font-display font-medium text-foreground">EVARACo.</span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-primary font-body">Luxury Hospitality</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-6">
                {[
                  { href: "https://instagram.com", icon: Instagram, external: true },
                  { href: "mailto:info@evaraco.com", icon: Mail },
                  { href: "tel:+919876543210", icon: Phone },
                ].map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
                  >
                    <link.icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-[10px] text-muted-foreground/60 font-body">© 2025 EVARACo. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="text-[10px] text-muted-foreground/60 font-body">Privacy Policy</span>
              <span className="text-[10px] text-muted-foreground/60 font-body">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
