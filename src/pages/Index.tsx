import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { hotels } from "@/data/hotels";
import { Phone, Mail, Instagram, Menu, X, MapPin, ArrowRight, Star } from "lucide-react";
import ElevatorTransition from "@/components/ElevatorTransition";
import { useElevatorNavigation } from "@/hooks/useElevatorNavigation";

const Index = () => {
  const { isTransitioning, navigateWithElevator, handleTransitionComplete } = useElevatorNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  } as const;

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
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
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div className="flex flex-col items-center gap-2 z-10">
              <motion.span
                className="text-2xl md:text-4xl tracking-[0.4em] uppercase font-display text-foreground font-medium"
                initial={{ opacity: 0, y: 8, letterSpacing: "0.6em" }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [8, 0, 0, -4],
                  letterSpacing: ["0.6em", "0.4em", "0.4em", "0.4em"],
                }}
                transition={{ duration: 1.8, times: [0, 0.25, 0.75, 1], ease: "easeInOut" }}
                onAnimationComplete={() => setIntroComplete(true)}
              >
                EVARA Co.
              </motion.span>
              <motion.div
                className="gold-divider"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.8, times: [0, 0.3, 0.7, 1], ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 glass-nav"
        initial={{ y: -60 }}
        animate={introComplete ? { y: 0 } : { y: -60 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between h-14">
          <div className="flex items-center gap-5">
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-foreground p-1">
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div className="hidden md:flex items-center gap-5">
              <a href="tel:+919876543210" className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground hover:text-primary transition-colors font-body flex items-center gap-1.5">
                <Phone className="w-3 h-3" /> Contact
              </a>
              <a href="mailto:info@evaraco.com" className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground hover:text-primary transition-colors font-body flex items-center gap-1.5">
                <Mail className="w-3 h-3" /> Email
              </a>
            </div>
          </div>

          {/* Center Logo — smaller */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <span className="text-sm tracking-[0.2em] uppercase font-display text-foreground font-semibold">
              EVARA Co.
            </span>
          </div>

          <div className="hidden md:flex items-center gap-5">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground hover:text-primary transition-colors font-body flex items-center gap-1.5">
              <Instagram className="w-3 h-3" /> Follow
            </a>
          </div>
          <div className="md:hidden w-4" />
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden border-t border-border bg-background overflow-hidden"
            >
              <div className="px-5 py-3 flex flex-col gap-3">
                <a href="tel:+919876543210" className="text-xs tracking-wider text-muted-foreground font-body flex items-center gap-2">
                  <Phone className="w-3 h-3" /> Contact
                </a>
                <a href="mailto:info@evaraco.com" className="text-xs tracking-wider text-muted-foreground font-body flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-xs tracking-wider text-muted-foreground font-body flex items-center gap-2">
                  <Instagram className="w-3 h-3" /> Follow
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Properties Section */}
      <main className="pt-20 pb-16 section-padding">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          animate={introComplete ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-px bg-primary/40" />
            <span className="text-[9px] tracking-[0.4em] uppercase text-primary font-body font-medium">Portfolio</span>
            <div className="w-8 h-px bg-primary/40" />
          </div>
          <h1 className="text-3xl md:text-5xl font-display text-foreground font-medium">Our Properties</h1>
          <p className="text-sm text-muted-foreground font-body mt-3 max-w-md mx-auto leading-relaxed">
            A curated collection of distinguished properties.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col gap-16 md:gap-24 max-w-6xl mx-auto"
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
              <div className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-6 md:gap-12 items-center`}>
                {/* Image */}
                <div className="flex-1 w-full overflow-hidden rounded-2xl">
                  <motion.div
                    className="overflow-hidden rounded-2xl"
                    whileHover={{ scale: 1.015 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <img
                      src={hotel.cardImage}
                      alt={hotel.name}
                      className="w-full aspect-[4/3] object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                </div>

                {/* Details */}
                <div className="flex-1 w-full flex flex-col justify-center py-2">
                  <div className="flex items-center gap-1.5 mb-2">
                    {Array.from({ length: hotel.rating }).map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 text-primary fill-primary" />
                    ))}
                  </div>
                  <span className="text-[9px] tracking-[0.25em] uppercase text-primary/60 font-body font-medium">{hotel.tagline}</span>
                  <h2 className="text-xl md:text-3xl font-display text-foreground font-medium mt-1">{hotel.name}</h2>
                  <div className="gold-divider-left mt-3 mb-4" />
                  <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-3">
                    {hotel.description}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 font-body mt-2 flex items-start gap-1">
                    <MapPin className="w-3 h-3 mt-0.5 shrink-0 text-primary/50" />
                    <span className="line-clamp-1">{hotel.address}</span>
                  </p>
                  <motion.span
                    className="mt-5 inline-flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase text-primary font-body font-semibold group-hover:gap-3 transition-all duration-300 self-start"
                    whileHover={{ x: 3 }}
                  >
                    Explore <ArrowRight className="w-3 h-3" />
                  </motion.span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="text-base tracking-[0.25em] uppercase font-display font-semibold text-foreground">EVARA Co.</span>
              <span className="text-[9px] tracking-[0.15em] uppercase text-primary font-body">Luxury Hospitality</span>
            </div>

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
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
                >
                  <link.icon className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-border flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-[9px] text-muted-foreground/50 font-body">© 2025 EVARA Co. All rights reserved.</p>
            <div className="flex gap-5">
              <span className="text-[9px] text-muted-foreground/50 font-body">Privacy Policy</span>
              <span className="text-[9px] text-muted-foreground/50 font-body">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;