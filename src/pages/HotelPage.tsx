import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { hotels } from "@/data/hotels";
import { ArrowLeft, Star, MapPin, X, Waves, Sparkles, UtensilsCrossed, TreePalm, Dumbbell, Wine, Car, Phone, Wifi, ArrowRight, Mail, Instagram, Coffee, Gamepad2, ParkingCircle, Droplets, Scissors, Menu } from "lucide-react";
import constructionImg from "@/assets/construction-coming-soon.png";
import ElevatorTransition from "@/components/ElevatorTransition";
import { useElevatorNavigation } from "@/hooks/useElevatorNavigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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

// Expanded descriptions for Learn More popup
const expandedDescriptions: Record<string, string> = {
  "CHAUKAA Restaurant": "CHAUKAA Restaurant at Hotel Evara is a multi-cuisine dining destination that seats up to 50 guests in a warm, contemporary setting. Our carefully curated menu features a blend of traditional Indian flavors and international cuisine, prepared by experienced chefs using fresh, locally sourced ingredients.\n\nThe restaurant offers breakfast, lunch, and dinner services with both à la carte and buffet options. Whether you're looking for a hearty North Indian thali, aromatic biryanis, flavorful Chinese dishes, or Continental classics — our kitchen delivers excellence with every plate.\n\nSpecial features include:\n• Live cooking stations during weekend brunches\n• Private dining arrangements for intimate celebrations\n• Seasonal menu rotations featuring regional specialties\n• Customizable group dining packages for families and corporate teams\n• Complimentary welcome drinks for hotel guests\n\nOperating Hours: Breakfast 7:00 AM – 10:30 AM | Lunch 12:00 PM – 3:30 PM | Dinner 7:00 PM – 11:00 PM",
  "Mandap Banquet Hall": "The Mandap Banquet Hall at Hotel Evara is a grand, versatile event space designed to host everything from intimate gatherings to large-scale celebrations. With its elegant interiors, modern lighting systems, and premium sound equipment, every event becomes a memorable experience.\n\nOur dedicated events team works closely with you to plan and execute flawless occasions, from décor and catering to entertainment and guest management.\n\nIdeal for:\n• Weddings & Receptions — Transform the hall into your dream wedding venue with customizable décor themes, floral arrangements, and stage setups\n• Engagement Ceremonies — Elegant settings for your special announcement with personalized touches\n• Birthday Celebrations — From milestone birthdays to surprise parties, we handle every detail\n• Corporate Events — Professional setups for conferences, seminars, product launches, and team-building events\n• Social Gatherings — Kitty parties, reunion dinners, anniversary celebrations, and festival events\n\nCapacity: Up to 200 guests (seated) | 350 guests (cocktail style)\nAmenities: Professional sound system, LED projector, customizable lighting, AC, valet parking, dedicated event coordinator\nCatering: In-house multi-cuisine catering with vegetarian and non-vegetarian options, customizable menus",
  "Open Rooftop Dining": "Experience the magic of dining under the stars at Hotel Evara's Open Rooftop. Perched atop the hotel, this enchanting space offers panoramic views of the city skyline, creating an unforgettable ambiance for every occasion.\n\nThe rooftop is designed with contemporary outdoor furniture, ambient string lights, and lush green accents that create a perfect blend of sophistication and natural beauty.\n\nPerfect for:\n• Romantic dinners with a view — Special couple's table with personalized service\n• Private celebrations — Birthday parties, anniversaries, and proposal setups\n• Corporate socials — Relaxed networking events and team celebrations\n• Weekend brunches — Enjoy sunny mornings with a curated brunch menu\n• Live music evenings — Select nights feature acoustic performances\n\nCapacity: Up to 40 guests\nAvailability: Open during evenings (6:00 PM onwards), weather permitting\nSpecial Services: Customizable décor, private event bookings, DJ setup available on request",
  "Comfortable Rooms & Suites": "Hotel Evara offers 22 thoughtfully designed rooms across three categories, each crafted to provide the perfect balance of comfort, style, and modern amenities.\n\n🏨 Twin Deluxe Rooms (5 rooms)\nSpacious rooms with twin bed configuration, ideal for business travelers and friends. Features include split AC, high-speed Wi-Fi, 32-inch LED TV, tea/coffee maker, and premium bath amenities.\nPricing: Single ₹2,999 | Double ₹3,799\n\n🏨 Deluxe Rooms (13 rooms)\nOur most popular category with king-size beds, contemporary décor, and city views. Equipped with all modern amenities including room service, laundry, and 24-hour hot water.\nPricing: Single ₹2,999 | Double ₹3,799\n\n🏨 Suite Rooms (4 rooms)\nThe pinnacle of luxury at Hotel Evara. Spacious suites with separate living area, premium furnishings, and exclusive amenities for guests seeking an elevated experience.\nPricing: Single ₹3,999 | Double ₹4,499\n\nAll Rooms Include:\n• Complimentary breakfast\n• High-speed Wi-Fi\n• 24-hour room service\n• Daily housekeeping\n• UPI & card payment accepted\n\nCheck-in: 12:00 Noon | Check-out: 11:00 AM\nEarly check-in and late check-out available on request (subject to availability)",
  "Multi-Cuisine Restaurant": "Dalaan Resort's Multi-Cuisine Restaurant offers an extensive dining experience with a menu that spans Indian, Chinese, Continental, and regional specialties. Set within the resort's lush green campus, the restaurant provides a serene dining environment perfect for families, couples, and groups.\n\nOur team of experienced chefs crafts each dish with premium ingredients and traditional techniques, ensuring an authentic culinary journey.\n\nHighlights:\n• Expansive menu covering North Indian, South Indian, Chinese, and Continental cuisines\n• Special Mithila cuisine corner featuring regional delicacies\n• Live BBQ and tandoor stations during dinner service\n• Private dining pavilions for special occasions\n• Customizable event catering with vegetarian and non-vegetarian options\n• Kid-friendly menu options available\n\nThe restaurant also provides outdoor seating in the garden area, perfect for breakfast and afternoon tea sessions surrounded by nature.",
  "Banquet Halls & Open Lawns": "Dalaan Resort features one of the most impressive event spaces in the region, with multiple banquet halls and four beautifully landscaped open lawns, each with unique characteristics to suit different event styles.\n\n🎪 Indoor Banquet Halls\nMultiple air-conditioned halls with modern AV equipment, customizable lighting, and elegant interiors. Perfect for weddings, receptions, corporate conferences, and social gatherings.\n\n🌿 Mithila Lawn\nThe signature outdoor space surrounded by traditional Mithila-inspired décor and fountain areas. Ideal for grand weddings and large cultural events.\n\n🌿 Garden Lawn\nA lush green space with mature trees and flower beds, perfect for daytime events, mehndi ceremonies, and garden parties.\n\n🌿 Poolside Lawn\nAdjacent to the swimming pool, this space offers a unique blend of water features and greenery for cocktail parties and evening celebrations.\n\n🌿 Fountain Lawn\nCentered around decorative fountains with ambient lighting, ideal for engagement ceremonies and intimate gatherings.\n\nCapacity: 100 to 1500+ guests across different spaces\nServices: In-house event planning, professional décor teams, catering, DJ & sound, valet parking, bride & groom preparation rooms",
  "Club House & Leisure": "The Club House at Dalaan Resort is a comprehensive leisure and recreation facility designed for guests of all ages. Whether you're looking to unwind, get active, or simply have fun — our club house has something for everyone.\n\n🏊 Swimming Pool\nA large, well-maintained swimming pool with separate kids' section. Poolside loungers, umbrellas, and a refreshment counter make it perfect for a full day of relaxation.\n\n💃 Rain Dance Area\nAn exciting rain dance floor with music and colored lighting — perfect for parties, celebrations, and weekend fun.\n\n💆 Spa & Salon\nProfessional spa services including aromatherapy massages, facials, body treatments, and salon services. Our trained therapists provide personalized treatments using premium products.\n\n🎮 Kids Zone\nA dedicated play area with age-appropriate activities, games, and supervised entertainment to keep young guests engaged and happy.\n\n🎱 Indoor Games\nTable tennis, snooker, carrom, and board games available in the air-conditioned games room.\n\nAll facilities are available exclusively to resort guests and event attendees.",
  "Luxury Stays & Villas": "Dalaan Resort offers an exceptional accommodation experience with luxury rooms and exclusive villa rooms, each designed to provide privacy, comfort, and a connection to nature.\n\n🏠 Luxury Rooms\nSpacious rooms with premium furnishings, modern amenities, and views of the resort's landscaped gardens. Each room features king-size beds, high-speed Wi-Fi, LED TV, mini-bar, tea/coffee maker, and premium bathroom amenities.\n\n🏡 Villa Rooms (Mithila Lawn Area)\nExclusive villa-style accommodations nestled in the Mithila Lawn area, surrounded by nature and tranquility. These private spaces offer:\n• Separate living and sleeping areas\n• Private sit-out with garden views\n• Premium interiors with traditional Mithila art accents\n• Enhanced privacy and dedicated butler service\n\n👰 Bridal & Groom Preparation Rooms\nSpecially designed rooms for wedding parties, featuring:\n• Full-length mirrors and professional lighting\n• Spacious dressing areas\n• Air-conditioned comfort\n• Room service and refreshments\n• Direct access to event venues\n\nAll accommodations include complimentary breakfast, 24-hour room service, housekeeping, and access to all resort facilities including the swimming pool, spa, and club house.",
};

const getExpandedDescription = (title: string, fallback: string): string => {
  return expandedDescriptions[title] || fallback;
};

const ParallaxImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className={`overflow-hidden ${className || ""}`}>
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-[115%] object-cover"
        style={{ y }}
        loading="lazy"
      />
    </div>
  );
};

const HotelPage = () => {
  const { id } = useParams();
  const { isTransitioning, navigateWithElevator, handleTransitionComplete } = useElevatorNavigation();
  const navigate = navigateWithElevator;
  const hotel = hotels.find((h) => h.id === id);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<number | null>(null);

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);

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
        <img src={constructionImg} alt="Under Construction" className="w-56 md:w-72 mb-6 opacity-80" />
        <h1 className="text-3xl md:text-4xl font-display text-foreground font-medium">{hotel.name}</h1>
        <p className="text-muted-foreground font-body mt-2 text-base tracking-wider">Opening Soon</p>
        <button
          onClick={() => navigate("/")}
          className="mt-8 group inline-flex items-center gap-2 border border-primary/30 text-primary px-7 py-2.5 text-[9px] tracking-[0.25em] uppercase font-body hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 rounded-full"
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

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between h-14">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] tracking-wider uppercase font-body hidden sm:inline">Back</span>
          </button>

          <div className="absolute left-1/2 -translate-x-1/2">
            <span className="text-sm tracking-[0.15em] uppercase font-display font-semibold">{hotel.name}</span>
          </div>

          <div className="hidden md:flex items-center gap-5">
            <a href="#about" className="text-[9px] tracking-[0.12em] uppercase text-muted-foreground hover:text-primary transition-colors font-body">About</a>
            <a href="#highlights" className="text-[9px] tracking-[0.12em] uppercase text-muted-foreground hover:text-primary transition-colors font-body">Experience</a>
            <a href="#rooms" className="text-[9px] tracking-[0.12em] uppercase text-muted-foreground hover:text-primary transition-colors font-body">Rooms</a>
            <a href="#amenities" className="text-[9px] tracking-[0.12em] uppercase text-muted-foreground hover:text-primary transition-colors font-body">Amenities</a>
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
              className="md:hidden border-t border-border bg-background overflow-hidden"
            >
              <div className="px-5 py-3 flex flex-col gap-2.5">
                <a href="#about" onClick={() => setMenuOpen(false)} className="text-xs tracking-wider text-muted-foreground font-body">About</a>
                <a href="#highlights" onClick={() => setMenuOpen(false)} className="text-xs tracking-wider text-muted-foreground font-body">Experience</a>
                <a href="#rooms" onClick={() => setMenuOpen(false)} className="text-xs tracking-wider text-muted-foreground font-body">Rooms</a>
                <a href="#amenities" onClick={() => setMenuOpen(false)} className="text-xs tracking-wider text-muted-foreground font-body">Amenities</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero with parallax */}
      <section ref={heroRef} className="relative h-[65vh] md:h-[80vh] overflow-hidden">
        <motion.img src={hotel.heroImage} alt={hotel.name} className="w-full h-[120%] object-cover" style={{ y: heroY }} />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/15 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-14">
          <div className="flex gap-1 mb-2">
            {Array.from({ length: hotel.rating }).map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5 text-primary fill-primary" />
            ))}
          </div>
          <span className="text-[9px] tracking-[0.3em] uppercase text-primary-foreground/60 font-body">
            {hotel.tagline}
          </span>
          <h1 className="text-3xl md:text-5xl font-display text-primary-foreground mt-1 font-medium">{hotel.name}</h1>
        </div>
      </section>

      {/* Address bar — below hero, beside About link */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground font-body flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-primary" />
            {hotel.address}, {hotel.city}
          </p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(hotel.address + ", " + hotel.city)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] tracking-[0.15em] uppercase text-primary font-body hover:underline"
          >
            View on Map →
          </a>
        </div>
      </div>

      {/* About */}
      <section id="about" className="section-padding max-w-3xl mx-auto text-center">
        <span className="text-[9px] tracking-[0.3em] uppercase text-primary font-body font-medium">Welcome to</span>
        <h2 className="text-2xl md:text-4xl font-display mt-2 text-foreground font-medium">{hotel.name}</h2>
        <div className="gold-divider mt-3 mb-5" />
        <p className="text-muted-foreground font-body leading-relaxed text-sm">{hotel.description}</p>
      </section>

      {/* Highlights with parallax images */}
      <section id="highlights" className="bg-secondary">
        {hotel.highlights.map((highlight, i) => (
          <div key={i} className="section-padding">
            <div className={`max-w-6xl mx-auto flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-14 items-center`}>
              <div className="flex-1 w-full">
                <ParallaxImage src={highlight.image} alt={highlight.title} className="rounded-2xl aspect-[4/3]" />
              </div>
              <div className="flex-1">
                <span className="text-[9px] tracking-[0.3em] uppercase text-primary font-body font-medium">Experience</span>
                <h3 className="text-xl md:text-3xl font-display mt-1 text-foreground font-medium">{highlight.title}</h3>
                <div className="gold-divider-left mt-2 mb-3" />
                <p className="text-muted-foreground font-body leading-relaxed text-sm line-clamp-3">{highlight.description}</p>
                <button
                  onClick={() => setSelectedHighlight(i)}
                  className="mt-5 group inline-flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase text-primary font-body font-semibold hover:gap-3 transition-all"
                >
                  Learn More
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Learn More Dialog — expanded content */}
      <Dialog open={selectedHighlight !== null} onOpenChange={(open) => !open && setSelectedHighlight(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0">
          {selectedHighlight !== null && hotel.highlights[selectedHighlight] && (
            <>
              <img
                src={hotel.highlights[selectedHighlight].image}
                alt={hotel.highlights[selectedHighlight].title}
                className="w-full aspect-[16/9] object-cover"
              />
              <div className="p-6 md:p-8">
                <DialogHeader>
                  <DialogTitle className="text-xl md:text-2xl font-display font-medium">{hotel.highlights[selectedHighlight].title}</DialogTitle>
                  <DialogDescription className="text-[9px] tracking-[0.2em] uppercase text-primary font-body mt-1">
                    {hotel.name} — Experience
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-5 space-y-3">
                  {getExpandedDescription(hotel.highlights[selectedHighlight].title, hotel.highlights[selectedHighlight].description)
                    .split("\n")
                    .filter(Boolean)
                    .map((para, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground font-body leading-relaxed whitespace-pre-wrap">
                        {para}
                      </p>
                    ))}
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-[10px] text-muted-foreground font-body">
                    For reservations and inquiries, contact us at{" "}
                    <a href="tel:+919876543210" className="text-primary hover:underline">+91 98765 43210</a>
                    {" "}or{" "}
                    <a href="mailto:info@evaraco.com" className="text-primary hover:underline">info@evaraco.com</a>
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Gallery */}
      <section className="section-padding">
        <div className="text-center mb-10">
          <span className="text-[9px] tracking-[0.3em] uppercase text-primary font-body font-medium">Gallery</span>
          <h3 className="text-xl md:text-3xl font-display mt-2 text-foreground font-medium">Moments & Emotions</h3>
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
          <span className="text-[9px] tracking-[0.3em] uppercase text-primary font-body font-medium">Accommodations</span>
          <h2 className="text-2xl md:text-4xl font-display mt-2 text-foreground font-medium">Rooms & Suites</h2>
          <div className="gold-divider mt-4" />
          <p className="text-sm text-muted-foreground font-body mt-4 max-w-md mx-auto leading-relaxed">
            Thoughtfully designed for comfort and elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {hotel.rooms.map((room, i) => (
            <motion.div
              key={i}
              className="group bg-card rounded-2xl overflow-hidden border border-border/30 transition-all duration-300"
              style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.03)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{
                y: -6,
                boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
              }}
            >
              <div className="relative overflow-hidden m-2.5 rounded-xl">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-600 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
                <div className="absolute top-2.5 right-2.5 rounded-xl px-3 py-1.5 backdrop-blur-lg" style={{
                  background: "hsl(var(--background) / 0.88)",
                  border: "1px solid hsl(var(--border) / 0.4)",
                }}>
                  <span className="text-sm font-display font-bold text-foreground">{room.price}</span>
                  <span className="text-[7px] text-muted-foreground font-body ml-1 uppercase tracking-widest">/night</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-base font-display text-background font-medium drop-shadow-md">{room.name}</h3>
                </div>
              </div>

              <div className="px-4 pb-4 pt-1.5">
                <p className="text-[11px] text-muted-foreground font-body leading-relaxed line-clamp-2">{room.description}</p>
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {room.features.slice(0, 3).map((f) => (
                    <span key={f} className="text-[7px] px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-primary/70 font-body tracking-widest uppercase">
                      {f}
                    </span>
                  ))}
                </div>
                <motion.button
                  className="mt-3 w-full py-2.5 rounded-lg text-[9px] tracking-[0.2em] uppercase font-display font-semibold border border-foreground/10 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
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
          <span className="text-[9px] tracking-[0.3em] uppercase text-primary font-body font-medium">Experience</span>
          <h2 className="text-2xl md:text-3xl font-display mt-2 text-foreground font-medium">Amenities</h2>
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
              <div className="text-primary">
                {amenityIcons[amenity] || <Wifi className="w-4 h-4" />}
              </div>
              <span className="text-[10px] text-muted-foreground font-body">{amenity}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-foreground text-center">
        <span className="text-[9px] tracking-[0.3em] uppercase text-primary font-body font-medium">Ready to Experience</span>
        <h2 className="text-2xl md:text-3xl font-display mt-2 text-background font-medium">{hotel.name}</h2>
        <div className="gold-divider mt-3 mb-5" />
        <p className="text-background/50 font-body max-w-sm mx-auto text-sm">
          Reserve your stay and discover unparalleled luxury.
        </p>
        <button className="mt-6 px-8 py-2.5 bg-primary text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-body rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
          Reserve Your Stay
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-foreground border-t border-background/10">
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="text-base tracking-[0.25em] uppercase font-display font-semibold text-background">EVARA Co.</span>
              <span className="text-[9px] tracking-[0.15em] uppercase text-primary font-body">Luxury Hospitality</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-[9px] tracking-[0.2em] uppercase text-background/35 font-body mb-1">Quick Links</span>
              <a href="#about" className="text-[10px] text-background/50 hover:text-primary transition-colors font-body">About</a>
              <a href="#rooms" className="text-[10px] text-background/50 hover:text-primary transition-colors font-body">Rooms & Suites</a>
              <a href="#amenities" className="text-[10px] text-background/50 hover:text-primary transition-colors font-body">Amenities</a>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <span className="text-[9px] tracking-[0.2em] uppercase text-background/35 font-body mb-1">Connect</span>
              <div className="flex gap-3">
                {[
                  { href: "https://instagram.com", icon: Instagram, external: true },
                  { href: "mailto:info@evaraco.com", icon: Mail },
                  { href: "tel:+919876543210", icon: Phone },
                ].map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="w-8 h-8 rounded-full border border-background/15 flex items-center justify-center text-background/40 hover:text-primary hover:border-primary transition-all duration-300"
                  >
                    <link.icon className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-background/10 text-center">
            <p className="text-[9px] text-background/35 font-body">© 2025 EVARA Co. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HotelPage;