import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { hotels } from "@/data/hotels";
import { Phone, Mail, Instagram, Menu, X, MapPin, ArrowRight, Star } from "lucide-react";
import ElevatorTransition from "@/components/ElevatorTransition";
import { useElevatorNavigation } from "@/hooks/useElevatorNavigation";

const Index = () => {
  const { isTransitioning, navigateWithElevator, handleTransitionComplete, handleDoorsFullyClosed } = useElevatorNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  } as const;

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body overflow-x-hidden">
      <ElevatorTransition isActive={isTransitioning} onComplete={handleTransitionComplete} onDoorsFullyClosed={handleDoorsFullyClosed} />

      {/* Intro Loader — white luxury reveal */}
      <AnimatePresence mode="wait">
        {!introComplete && (
          <motion.div
            className="fixed inset-0 z-[9998] flex items-center justify-center"
            style={{ background: "#ffffff" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Subtle radial glow behind logo */}
            <motion.div
              className="absolute"
              style={{
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(140,120,80,0.18) 0%, transparent 70%)",
              }}
              animate={{ scale: [0.8, 1.3, 1.3], opacity: [0, 1, 0] }}
              transition={{ duration: 2.5, times: [0, 0.4, 1], ease: "easeInOut" }}
            />

            <motion.div className="flex flex-col items-center gap-4 z-10">
              {/* Top ornamental line */}
              <motion.div
                className="h-px"
                style={{ background: "linear-gradient(90deg, transparent, #8a7554, transparent)" }}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: [0, 80, 80, 0], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.5, times: [0, 0.2, 0.7, 1], ease: "easeInOut" }}
              />

              {/* Brand name */}
              <motion.span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(2rem, 6vw, 3.6rem)",
                  letterSpacing: "0.45em",
                  fontWeight: 400,
                  color: "#1a1612",
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: [0, 1, 1, 0], y: [12, 0, 0, -8] }}
                transition={{ duration: 2.5, times: [0, 0.15, 0.7, 1], ease: "easeInOut" }}
              >
                EVARA
              </motion.span>

              {/* Tagline */}
              <motion.span
                className="tracking-[0.5em] uppercase"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "9px",
                  color: "#6b5d4a",
                  fontWeight: 400,
                }}
                initial={{ opacity: 0, letterSpacing: "0.3em" }}
                animate={{
                  opacity: [0, 0.7, 0.7, 0],
                  letterSpacing: ["0.3em", "0.5em", "0.5em", "0.6em"],
                }}
                transition={{ duration: 2.5, times: [0, 0.2, 0.65, 1], ease: "easeInOut" }}
                onAnimationComplete={() => setIntroComplete(true)}
              >
                Luxury Hospitality
              </motion.span>

              {/* Bottom ornamental line */}
              <motion.div
                className="h-px"
                style={{ background: "linear-gradient(90deg, transparent, #c4b496, transparent)" }}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: [0, 60, 60, 0], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.5, times: [0, 0.2, 0.7, 1], ease: "easeInOut" }}
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
              <a href="tel:+919031027961" className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground hover:text-primary transition-colors font-body flex items-center gap-1.5">
                <Phone className="w-3 h-3" /> Contact
              </a>
              <a href="mailto:info@hotelevara.in" className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground hover:text-primary transition-colors font-body flex items-center gap-1.5">
                <Mail className="w-3 h-3" /> Email
              </a>
            </div>
          </div>

          {/* Center Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <span className="text-sm tracking-[0.25em] uppercase font-display text-foreground" style={{ fontWeight: 300 }}>
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

        {/* Mobile Menu */}
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
              <div className="px-8 py-6 flex flex-col gap-5">
                <span className="text-[8px] tracking-[0.4em] uppercase text-muted-foreground/40 font-body">Menu</span>
                {[
                  { href: "tel:+919031027961", icon: Phone, label: "Contact" },
                  { href: "mailto:info@hotelevara.in", icon: Mail, label: "Email" },
                  { href: "https://instagram.com", icon: Instagram, label: "Follow Us" },
                ].map((item, i) => (
                  <motion.a
                    key={i}
                    href={item.href}
                    {...(item.label === "Follow Us" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors group"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <item.icon className="w-3.5 h-3.5 text-primary/50 group-hover:text-primary transition-colors" />
                    <span className="text-xs tracking-[0.15em] uppercase font-body" style={{ fontWeight: 400 }}>{item.label}</span>
                  </motion.a>
                ))}
                <div className="w-8 h-px bg-primary/20 mt-1" />
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
            <div className="w-8 h-px bg-primary/30" />
            <span className="text-[9px] tracking-[0.4em] uppercase text-primary/70 font-body" style={{ fontWeight: 400 }}>Portfolio</span>
            <div className="w-8 h-px bg-primary/30" />
          </div>
          <h1 className="text-3xl md:text-5xl font-display text-foreground tracking-wide" style={{ fontWeight: 300 }}>Our Properties</h1>
          <p className="text-sm text-muted-foreground font-body mt-3 max-w-md mx-auto leading-relaxed" style={{ fontWeight: 400 }}>
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
                <div className="flex-1 w-full overflow-hidden rounded-2xl">
                  <motion.div
                    className="overflow-hidden rounded-2xl"
                    whileHover={{ scale: 1.015 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <img src={hotel.cardImage} alt={hotel.name} className="w-full aspect-[4/3] object-cover" loading="lazy" />
                  </motion.div>
                </div>

                <div className="flex-1 w-full flex flex-col justify-center py-2">
                  <div className="flex items-center gap-1.5 mb-2">
                    {Array.from({ length: hotel.rating }).map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 text-primary fill-primary" />
                    ))}
                  </div>
                  <span className="text-[9px] tracking-[0.25em] uppercase text-primary/50 font-body" style={{ fontWeight: 400 }}>{hotel.tagline}</span>
                  <h2 className="text-xl md:text-3xl font-display text-foreground tracking-wide mt-1" style={{ fontWeight: 300 }}>{hotel.name}</h2>
                  <div className="gold-divider-left mt-3 mb-4" />
                  <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-3" style={{ fontWeight: 400 }}>
                    {hotel.description}
                  </p>
                  <p className="text-[10px] text-muted-foreground/50 font-body mt-2 flex items-start gap-1" style={{ fontWeight: 400 }}>
                    <MapPin className="w-3 h-3 mt-0.5 shrink-0 text-primary/40" />
                    <span className="line-clamp-1">{hotel.address}</span>
                  </p>
                  <motion.span
                    className="mt-5 inline-flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase text-primary font-body group-hover:gap-3 transition-all duration-300 self-start"
                    style={{ fontWeight: 500 }}
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
              <span className="text-base tracking-[0.25em] uppercase font-display text-foreground" style={{ fontWeight: 300 }}>EVARA Co.</span>
              <span className="text-[9px] tracking-[0.15em] uppercase text-primary/60 font-body" style={{ fontWeight: 400 }}>Luxury Hospitality</span>
            </div>
            <div className="flex gap-4">
              {[
                { href: "https://instagram.com", icon: Instagram, external: true },
                { href: "mailto:info@hotelevara.in", icon: Mail },
                { href: "tel:+919031027961", icon: Phone },
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
            <p className="text-[9px] text-muted-foreground/40 font-body" style={{ fontWeight: 400 }}>© 2025 EVARA Co. All rights reserved.</p>
            <div className="flex gap-5">
              <span className="text-[9px] text-muted-foreground/40 font-body" style={{ fontWeight: 400 }}>Privacy Policy</span>
              <span className="text-[9px] text-muted-foreground/40 font-body" style={{ fontWeight: 400 }}>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
