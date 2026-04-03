import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { hotels } from "@/data/hotels";
import { Phone, Mail, Instagram, Menu, X, ArrowRight, Star } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { usePageTransition } from "@/hooks/usePageTransition";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const { isTransitioning, targetImage, navigateWithTransition, handleMidpoint, handleComplete } = usePageTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);

  // GSAP scroll animations for hotel cards
  useEffect(() => {
    if (!introComplete) return;
    
    cardsRef.current.forEach((card) => {
      if (!card) return;
      gsap.fromTo(card,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" },
        }
      );
    });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, [introComplete]);

  // Intro timer
  useEffect(() => {
    const timer = setTimeout(() => setIntroComplete(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-body overflow-x-hidden">
      <PageTransition isActive={isTransitioning} onMidpoint={handleMidpoint} onComplete={handleComplete} targetImage={targetImage} />

      {/* Intro Loader */}
      <AnimatePresence mode="wait">
        {!introComplete && (
          <motion.div
            className="fixed inset-0 z-[9998] flex items-center justify-center"
            style={{ background: "hsl(40 18% 96%)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Radial glow */}
            <motion.div
              className="absolute"
              style={{
                width: "320px", height: "320px", borderRadius: "50%",
                background: "radial-gradient(circle, hsl(34 42% 42% / 0.15) 0%, transparent 70%)",
              }}
              animate={{ scale: [0.6, 1.4, 1.4], opacity: [0, 1, 0] }}
              transition={{ duration: 2.5, times: [0, 0.4, 1], ease: "easeInOut" }}
            />

            <motion.div className="flex flex-col items-center gap-5 z-10">
              {/* Top line */}
              <motion.div
                className="h-px"
                style={{ background: "linear-gradient(90deg, transparent, hsl(34 42% 42%), transparent)" }}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: [0, 90, 90, 0], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.5, times: [0, 0.15, 0.7, 1], ease: "easeInOut" }}
              />

              {/* Brand */}
              <motion.span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(2.2rem, 7vw, 4rem)",
                  letterSpacing: "0.5em",
                  fontWeight: 300,
                  color: "hsl(30 10% 12%)",
                }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: [0, 1, 1, 0], y: [14, 0, 0, -10] }}
                transition={{ duration: 2.5, times: [0, 0.12, 0.7, 1], ease: "easeInOut" }}
              >
                EVARA
              </motion.span>

              {/* Subtitle */}
              <motion.span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.5em",
                  color: "hsl(34 42% 42%)",
                  fontWeight: 400,
                  textTransform: "uppercase",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0.8, 0] }}
                transition={{ duration: 2.5, times: [0, 0.18, 0.65, 1], ease: "easeInOut" }}
              >
                Luxury Hospitality
              </motion.span>

              {/* Bottom line */}
              <motion.div
                className="h-px"
                style={{ background: "linear-gradient(90deg, transparent, hsl(34 42% 42%), transparent)" }}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: [0, 60, 60, 0], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.5, times: [0, 0.15, 0.7, 1], ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.nav
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 glass-nav"
        initial={{ y: -60 }}
        animate={introComplete ? { y: 0 } : { y: -60 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between h-12 md:h-14">
          <div className="flex items-center gap-4">
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-foreground p-1">
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div className="hidden md:flex items-center gap-5">
              <a href="tel:+919031027961" className="text-[9px] tracking-[0.12em] uppercase text-muted-foreground hover:text-primary transition-colors font-body flex items-center gap-1.5" style={{ fontWeight: 400 }}>
                <Phone className="w-3 h-3" /> Contact
              </a>
              <a href="mailto:info@hotelevara.in" className="text-[9px] tracking-[0.12em] uppercase text-muted-foreground hover:text-primary transition-colors font-body flex items-center gap-1.5" style={{ fontWeight: 400 }}>
                <Mail className="w-3 h-3" /> Email
              </a>
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
            <span className="text-xs tracking-[0.2em] uppercase font-display text-foreground" style={{ fontWeight: 300 }}>
              EVARA
            </span>
          </div>

          <div className="hidden md:flex items-center gap-5">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[9px] tracking-[0.12em] uppercase text-muted-foreground hover:text-primary transition-colors font-body flex items-center gap-1.5" style={{ fontWeight: 400 }}>
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
              className="md:hidden overflow-hidden border-t border-border/40"
              style={{ background: "hsl(var(--background))" }}
            >
              <div className="px-6 py-5 flex flex-col gap-4">
                <span className="text-[8px] tracking-[0.4em] uppercase text-muted-foreground/40 font-body">Menu</span>
                {[
                  { href: "tel:+919031027961", icon: Phone, label: "Contact" },
                  { href: "mailto:info@hotelevara.in", icon: Mail, label: "Email" },
                  { href: "https://instagram.com", icon: Instagram, label: "Follow Us", external: true },
                ].map((item, i) => (
                  <motion.a
                    key={i}
                    href={item.href}
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center gap-3 text-foreground/60 hover:text-primary transition-colors group"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <item.icon className="w-3.5 h-3.5 text-primary/40 group-hover:text-primary transition-colors" />
                    <span className="text-xs tracking-[0.15em] uppercase font-body" style={{ fontWeight: 400 }}>{item.label}</span>
                  </motion.a>
                ))}
                <div className="w-8 h-px bg-primary/15 mt-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section - Inspired by reference image */}
      <motion.section
        className="relative min-h-[90vh] md:min-h-screen flex items-center"
        initial={{ opacity: 0 }}
        animate={introComplete ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Split background */}
        <div className="absolute inset-0 flex">
          <div className="w-1/2 hidden md:block" style={{ background: "hsl(var(--background))" }}>
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 w-1/2" style={{
              backgroundImage: `linear-gradient(hsl(var(--border) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.3) 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
            }} />
          </div>
          <div className="w-full md:w-1/2 relative">
            <div className="absolute inset-0" style={{
              background: "linear-gradient(135deg, hsl(38 28% 26%) 0%, hsl(34 22% 22%) 40%, hsl(30 18% 18%) 100%)",
            }} />
            {/* Geometric art deco pattern overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
              <path d="M200 100 L280 200 L200 300 L120 200 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
              <circle cx="200" cy="200" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
              <circle cx="200" cy="200" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
              <line x1="200" y1="0" x2="200" y2="800" stroke="currentColor" strokeWidth="0.3" className="text-primary" />
              <path d="M100 400 L200 500 L300 400" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
              <path d="M150 600 A50 50 0 0 1 250 600" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-14 py-20 md:py-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={introComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-primary/50" />
              <span className="text-[9px] tracking-[0.4em] uppercase font-body md:text-primary-foreground/60 text-primary/60" style={{ fontWeight: 400 }}>
                The Evara Collection
              </span>
            </div>

            <h1 className="font-display tracking-wide leading-[1.1]" style={{ fontWeight: 300 }}>
              <span className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl md:text-primary-foreground text-foreground block">Where </span>
              <span className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-gold-gradient italic block">Luxury</span>
              <span className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl md:text-primary-foreground text-foreground block">Meets Legacy</span>
            </h1>

            <p className="mt-6 max-w-md text-sm md:text-base leading-relaxed font-body md:text-primary-foreground/40 text-muted-foreground" style={{ fontWeight: 300 }}>
              Three extraordinary hotels, one defining philosophy — every stay is a story written in gold, silence, and pure indulgence.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <a
                href="#properties"
                className="px-8 py-3 bg-foreground text-background text-[9px] tracking-[0.25em] uppercase font-body inline-flex items-center gap-2 hover:bg-foreground/90 transition-colors"
                style={{ fontWeight: 500 }}
              >
                Explore Hotels
              </a>
              <a
                href="#properties"
                className="px-6 py-3 text-[9px] tracking-[0.25em] uppercase font-body inline-flex items-center gap-2 md:text-primary-foreground/50 text-muted-foreground hover:text-primary transition-colors"
                style={{ fontWeight: 400 }}
              >
                Discover More <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Properties Section */}
      <main id="properties" className="py-16 md:py-24 section-padding">
        <motion.div
          className="text-center mb-14 md:mb-20"
          initial={{ opacity: 0, y: 16 }}
          animate={introComplete ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-px bg-primary/30" />
            <span className="text-[9px] tracking-[0.4em] uppercase text-primary/60 font-body" style={{ fontWeight: 400 }}>Portfolio</span>
            <div className="w-8 h-px bg-primary/30" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-display text-foreground tracking-wide" style={{ fontWeight: 300 }}>Our Properties</h2>
          <p className="text-sm text-muted-foreground font-body mt-3 max-w-md mx-auto leading-relaxed" style={{ fontWeight: 300 }}>
            A curated collection of distinguished properties.
          </p>
        </motion.div>

        <div className="flex flex-col gap-16 md:gap-28 max-w-6xl mx-auto">
          {hotels.map((hotel, index) => (
            <div
              key={hotel.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="cursor-pointer group"
              onClick={() => navigateWithTransition(`/hotel/${hotel.id}`, hotel.cardImage)}
              style={{ opacity: 0 }}
            >
              <div className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-6 md:gap-12 items-center`}>
                <div className="flex-1 w-full overflow-hidden rounded-lg md:rounded-xl">
                  <div className="overflow-hidden rounded-lg md:rounded-xl group-hover:shadow-lg transition-shadow duration-500">
                    <img
                      src={hotel.cardImage}
                      alt={hotel.name}
                      className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="flex-1 w-full flex flex-col justify-center py-2">
                  <div className="flex items-center gap-1.5 mb-2">
                    {Array.from({ length: hotel.rating }).map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 text-primary fill-primary" />
                    ))}
                  </div>
                  <span className="text-[9px] tracking-[0.25em] uppercase text-primary/40 font-body" style={{ fontWeight: 300 }}>{hotel.tagline}</span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-display text-foreground tracking-wide mt-1" style={{ fontWeight: 300 }}>{hotel.name}</h3>
                  <div className="gold-divider-left mt-3 mb-4" />
                  <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-3" style={{ fontWeight: 300 }}>
                    {hotel.description}
                  </p>
                  <span
                    className="mt-5 inline-flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase text-primary font-body group-hover:gap-3 transition-all duration-300 self-start"
                    style={{ fontWeight: 400 }}
                  >
                    Explore <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border" style={{ background: "hsl(var(--foreground))" }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-10 py-10 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="text-base tracking-[0.25em] uppercase font-display text-background" style={{ fontWeight: 300 }}>EVARA Co.</span>
              <span className="text-[9px] tracking-[0.15em] uppercase text-primary/50 font-body" style={{ fontWeight: 300 }}>Luxury Hospitality</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-[8px] tracking-[0.2em] uppercase text-background/25 font-body mb-1" style={{ fontWeight: 400 }}>Contact</span>
              <a href="tel:+919031027961" className="text-[10px] text-background/35 hover:text-primary transition-colors font-body" style={{ fontWeight: 300 }}>+91 9031027961</a>
              <a href="mailto:info@hotelevara.in" className="text-[10px] text-background/35 hover:text-primary transition-colors font-body" style={{ fontWeight: 300 }}>info@hotelevara.in</a>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <span className="text-[8px] tracking-[0.2em] uppercase text-background/25 font-body mb-1" style={{ fontWeight: 400 }}>Connect</span>
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
                    className="w-8 h-8 rounded-full border border-background/10 flex items-center justify-center text-background/25 hover:text-primary hover:border-primary transition-all duration-300"
                  >
                    <link.icon className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-background/10 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-[9px] text-background/20 font-body" style={{ fontWeight: 300 }}>© 2025 EVARA Co. All rights reserved.</p>
            <div className="flex gap-5">
              <span className="text-[9px] text-background/20 font-body" style={{ fontWeight: 300 }}>Privacy Policy</span>
              <span className="text-[9px] text-background/20 font-body" style={{ fontWeight: 300 }}>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
