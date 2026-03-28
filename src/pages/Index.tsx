import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { hotels } from "@/data/hotels";
import { Phone, Mail, Instagram, Menu, X, MapPin, ArrowRight, Star, ChevronDown } from "lucide-react";
import ElevatorTransition from "@/components/ElevatorTransition";
import { useElevatorNavigation } from "@/hooks/useElevatorNavigation";

const Index = () => {
  const { isTransitioning, navigateWithElevator, handleTransitionComplete } = useElevatorNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
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
            <motion.div
              className="absolute rounded-full border border-primary/30"
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ width: 500, height: 500, opacity: [0, 0.5, 0] }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            />
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

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 glass-nav"
        initial={{ y: -80 }}
        animate={introComplete ? { y: 0 } : { y: -80 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-12 flex items-center justify-between h-16">
          <span className="text-lg tracking-[0.25em] uppercase font-display text-foreground font-semibold">
            EVARACo.
          </span>
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "tel:+919876543210", icon: Phone, label: "Contact" },
              { href: "mailto:info@evaraco.com", icon: Mail, label: "Email" },
              { href: "https://instagram.com", icon: Instagram, label: "Follow", external: true },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300 font-body flex items-center gap-1.5"
              >
                <link.icon className="w-3.5 h-3.5" /> {link.label}
              </a>
            ))}
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-foreground p-1">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
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

      {/* Hero Section */}
      <motion.section
        className="relative pt-28 pb-8 md:pt-36 md:pb-12 section-padding text-center"
        initial={{ opacity: 0 }}
        animate={introComplete ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={introComplete ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="gold-divider-left" />
            <span className="text-[10px] tracking-[0.5em] uppercase text-primary font-body">Luxury Hospitality</span>
            <div className="gold-divider-left" style={{ transform: "scaleX(-1)" }} />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-foreground font-light leading-[1.1]">
            Experience
            <span className="block text-gold-gradient font-medium italic mt-1">Timeless Elegance</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-body mt-6 max-w-lg mx-auto leading-relaxed">
            Discover our collection of distinguished properties — where every detail is crafted for an extraordinary stay.
          </p>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-1 text-muted-foreground/50"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-[9px] tracking-[0.3em] uppercase">Explore</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.section>

      {/* Properties Section */}
      <main className="pb-20 section-padding">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={introComplete ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-body">Portfolio</span>
          <h2 className="text-3xl md:text-4xl font-display mt-2 text-foreground font-light">Our Properties</h2>
          <div className="gold-divider mt-4" />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={stagger}
          initial="hidden"
          animate={introComplete ? "show" : "hidden"}
        >
          {hotels.map((hotel) => (
            <motion.div
              key={hotel.id}
              variants={fadeUp}
              className="cursor-pointer group"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigateWithElevator(`/hotel/${hotel.id}`)}
            >
              {/* Card */}
              <div className="relative overflow-hidden rounded-2xl bg-card border border-border hover-gold-border luxury-shadow">
                {/* Image container */}
                <div className="relative overflow-hidden aspect-[3/4]">
                  <img
                    src={hotel.cardImage}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out gpu-accelerated"
                    loading="lazy"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />

                  {/* Rating badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border/50">
                    <Star className="w-3 h-3 text-primary fill-primary" />
                    <span className="text-[10px] font-body font-semibold text-foreground">{hotel.rating}.0</span>
                  </div>

                  {/* Bottom info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-display text-background font-medium">{hotel.name}</h3>
                    <p className="text-[11px] text-background/70 font-body mt-1 flex items-start gap-1">
                      <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                      <span className="line-clamp-1">{hotel.address}</span>
                    </p>
                  </div>
                </div>

                {/* Bottom bar */}
                <div className="px-5 py-3.5 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-body italic">{hotel.tagline}</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-primary font-body inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-300 font-medium">
                    Explore <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Subscribe Section */}
      <section className="section-padding bg-secondary relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent)" }} />

        <motion.div
          className="max-w-xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-body">Stay Connected</span>
          <h3 className="text-2xl md:text-3xl font-display mt-2 text-foreground font-light">Exclusive Privileges Await</h3>
          <p className="text-sm text-muted-foreground font-body mt-4 max-w-md mx-auto leading-relaxed">
            Subscribe for curated offers, seasonal packages, and early access to our newest properties.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 text-sm font-body bg-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-300"
            />
            <button className="px-8 py-3 bg-primary text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-body font-medium rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
              Subscribe
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground/60 font-body mt-3">
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="section-padding" style={{ background: "hsl(var(--charcoal))", color: "hsl(var(--cream))" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="text-base tracking-[0.3em] uppercase font-display font-medium">EVARACo.</span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-primary font-body">Luxury Hospitality</span>
            </div>
            <p className="text-[11px] font-body opacity-40">© 2025 EVARACo. All rights reserved.</p>
            <div className="flex gap-5">
              {[
                { href: "https://instagram.com", icon: Instagram, external: true },
                { href: "mailto:info@evaraco.com", icon: Mail },
                { href: "tel:+919876543210", icon: Phone },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="opacity-40 hover:opacity-100 hover:text-primary transition-all duration-300"
                >
                  <link.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
