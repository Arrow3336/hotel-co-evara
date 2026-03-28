import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { hotels } from "@/data/hotels";
import { Phone, Mail, Instagram, Menu, X, MapPin, ArrowRight } from "lucide-react";
import ElevatorTransition from "@/components/ElevatorTransition";
import { useElevatorNavigation } from "@/hooks/useElevatorNavigation";

const Index = () => {
  const { isTransitioning, navigateWithElevator, handleTransitionComplete } = useElevatorNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-body overflow-x-hidden">
      {/* Elevator Transition — only for hotel pages */}
      <ElevatorTransition isActive={isTransitioning} onComplete={handleTransitionComplete} />

      {/* Intro Animation — golden ring pulse */}
      <AnimatePresence mode="wait">
        {!introComplete && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Expanding golden ring */}
            <motion.div
              className="absolute rounded-full border-2 border-primary/40"
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ width: 600, height: 600, opacity: [0, 0.6, 0] }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            <motion.div
              className="absolute rounded-full border border-primary/20"
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ width: 900, height: 900, opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
            />

            {/* Brand name */}
            <motion.div className="flex flex-col items-center gap-3 z-10">
              <motion.span
                className="text-3xl md:text-4xl tracking-[0.4em] uppercase font-display text-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -5] }}
                transition={{ duration: 2, times: [0, 0.2, 0.75, 1], ease: "easeInOut" }}
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

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 glass-nav"
        initial={{ y: -80 }}
        animate={introComplete ? { y: 0 } : { y: -80 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-12 flex items-center justify-between h-16">
          <span className="text-lg tracking-[0.2em] uppercase font-display text-foreground font-semibold">
            EVARACo.
          </span>
          <div className="hidden md:flex items-center gap-8">
            <a href="tel:+919876543210" className="text-xs tracking-wider text-muted-foreground hover:text-primary transition-colors duration-300 font-body flex items-center gap-1.5">
              <Phone className="w-3 h-3" /> Contact
            </a>
            <a href="mailto:info@evaraco.com" className="text-xs tracking-wider text-muted-foreground hover:text-primary transition-colors duration-300 font-body flex items-center gap-1.5">
              <Mail className="w-3 h-3" /> Email
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-xs tracking-wider text-muted-foreground hover:text-primary transition-colors duration-300 font-body flex items-center gap-1.5">
              <Instagram className="w-3 h-3" /> Follow
            </a>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-foreground">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden border-t border-border bg-background overflow-hidden"
            >
              <div className="px-5 py-4 flex flex-col gap-3">
                <a href="tel:+919876543210" className="text-xs tracking-wider text-muted-foreground font-body flex items-center gap-1.5">
                  <Phone className="w-3 h-3" /> Contact
                </a>
                <a href="mailto:info@evaraco.com" className="text-xs tracking-wider text-muted-foreground font-body flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> Email
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-xs tracking-wider text-muted-foreground font-body flex items-center gap-1.5">
                  <Instagram className="w-3 h-3" /> Follow
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main Content — 3 Hotel Cards */}
      <main className="pt-24 pb-16 section-padding">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={introComplete ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-body">Discover</span>
          <h2 className="text-3xl md:text-5xl font-display mt-2 text-foreground">Our Properties</h2>
          <div className="gold-divider mt-4" />
        </motion.div>

        {/* Hotel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {hotels.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              className="cursor-pointer group"
              initial={{ opacity: 0, y: 40 }}
              animate={introComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 + index * 0.15, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              onClick={() => navigateWithElevator(`/hotel/${hotel.id}`)}
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[3/4]">
                <img
                  src={hotel.cardImage}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Info below image */}
              <div className="pt-4 pb-2">
                <h3 className="text-xl font-display text-foreground">{hotel.name}</h3>
                <p className="text-[11px] text-muted-foreground font-body mt-1 flex items-start gap-1">
                  <MapPin className="w-3 h-3 mt-0.5 shrink-0 text-primary" />
                  {hotel.address}
                </p>
                <span className="text-[10px] tracking-[0.2em] uppercase text-primary font-body mt-2 inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                  {hotel.city}
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Newsletter / Subscribe Section */}
      <section className="section-padding bg-secondary">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-body">Stay Connected</span>
          <h3 className="text-2xl md:text-3xl font-display mt-2 text-foreground">Exclusive Privileges Await</h3>
          <p className="text-sm text-muted-foreground font-body mt-4 max-w-md mx-auto">
            Subscribe to receive curated offers, seasonal packages, and early access to our newest properties.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 text-sm font-body bg-background border border-border focus:border-primary focus:outline-none transition-colors duration-300"
            />
            <button className="px-8 py-3 bg-primary text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-body hover:bg-gold-dark transition-colors duration-300">
              Subscribe
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground font-body mt-3">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="section-padding bg-foreground text-background">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-sm tracking-[0.2em] uppercase font-display">EVARACo.</span>
          <p className="text-[11px] text-background/50 font-body">© 2025 EVARACo. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-background/50 hover:text-background transition-colors duration-300">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="mailto:info@evaraco.com" className="text-background/50 hover:text-background transition-colors duration-300">
              <Mail className="w-4 h-4" />
            </a>
            <a href="tel:+919876543210" className="text-background/50 hover:text-background transition-colors duration-300">
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
