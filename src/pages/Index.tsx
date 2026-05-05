import { useState, useMemo } from "react";
import {
  ArrowRight,
  Leaf,
  Sun,
  Truck,
  MapPin,
  Phone,
  Mail,
  Star,
  Search,
} from "lucide-react";
import { products } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import heroImage from "@/assets/hero-mangoes.jpg";
import aboutCollage from "@/assets/about-collage.jpg";
import aboutCollage2 from "@/assets/about-collage-2.jpg";

const features = [
  {
    icon: Leaf,
    title: "100% Natural",
    text: "No pesticides, no carbide, no shortcuts. Just orchard-fresh mangoes.",
  },
  {
    icon: Sun,
    title: "Sun-ripened",
    text: "Allowed to ripen on the tree until they reach peak sweetness.",
  },
  {
    icon: Truck,
    title: "Farm to door",
    text: "Hand-packed and shipped within 24 hours of harvest.",
  },
];

const testimonials = [
  {
    name: "Priya R.",
    city: "Bengaluru",
    quote:
      "The Banganapalli box was like the mangoes from my childhood. Fragrant, juicy, no chemical aftertaste.",
  },
  {
    name: "Arjun M.",
    city: "Hyderabad",
    quote:
      "Reliable delivery and the Himayat was unreal. Anunatural is now our family's monthly ritual in summer.",
  },
  {
    name: "Sneha K.",
    city: "Mumbai",
    quote:
      "You can taste the sunshine. Beautifully packed and every fruit ripened evenly. Five stars.",
  },
];

const Index = () => {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* 🔍 Search Bar */}
      <section className="w-full bg-gradient-to-r from-white-50 to-white-50 border-border/60">
        <div className="container py-6 flex justify-center">
          <div className="relative w-full max-w-xl group">
            {/* Glow */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-green-400 to-lime-400 opacity-0 blur-md transition-all duration-300 group-focus-within:opacity-60"></div>

            {/* Input */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mangoes, oils..."
              className="relative w-full rounded-full border border-border bg-white px-6 py-3 pr-12 text-sm outline-none focus:border-green-500"
            />

            {/* Icon */}
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600">
              <Search className="h-4 w-4" />
            </span>

            {/* Results */}
            {query && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-green-50"
                      onClick={() => {
                        setQuery("");
                        document.getElementById("shop")?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                      <p className="text-sm font-semibold text-primary">
                        {p.name}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="px-4 py-3 text-sm text-muted-foreground">
                    No products found
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="relative overflow-hidden bg-cream">
        <div className="container grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Leaf className="h-3.5 w-3.5" /> 100% Natural · Pesticide-free
            </span>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-balance text-primary sm:text-6xl lg:text-7xl">
              Naturally ripened{" "}
              <em className="not-italic text-accent">mangoes</em>, straight from
              the orchard.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              AnuNatural Foods brings you India&apos;s finest mango varieties —
              picked at peak ripeness, packed by hand and delivered to your
              door.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#shop"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:scale-105 hover:shadow-card"
              >
                Shop the harvest <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-7 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-muted"
              >
                About us
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-mango opacity-20 blur-3xl" />
            <img
              src={heroImage}
              alt="Fresh ripe Indian mangoes on a wooden surface"
              width={1536}
              height={1152}
              className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-card"
            />
          </div>
        </div>
      </section>

      {/* About us */}
      <section id="about" className="container py-20">
        <div className="grid gap-12 lg:grid-cols-2 items-center min-h-[500px]">
          {/* LEFT CONTENT */}
          <div className="space-y-5 flex flex-col justify-center h-full">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">
              About us
            </span>

            <h2 className="font-display text-4xl font-bold text-primary sm:text-5xl">
              Welcome to{" "}
              <em className="not-italic text-accent">AnuNatural Foods</em>
            </h2>

            <p className="text-lg text-muted-foreground">
              AnuNatural Foods delivers tree-ripened mangoes and cold-pressed
              oils from Andhra Pradesh and Telangana family farms, cultivated
              and processed without chemicals, artificial ripening, or refining
              to preserve natural purity.
            </p>

            <p className="text-lg text-muted-foreground">
              AnuNatural Foods supplies naturally cured, tree-ripened mangoes
              and cold-pressed cooking oils sourced from select family farms.
              All products are prepared using traditional methods within 24
              hours of harvest, ensuring absence of carbide, additives,
              preservatives, and artificial refining.
            </p>

            {/* FEATURES */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {features.map(({ icon: Icon, title }) => (
                <div
                  key={title}
                  className="rounded-xl border border-border/60 bg-card p-4 text-center hover:shadow-md transition"
                >
                  <Icon className="mx-auto h-6 w-6 text-primary" />
                  <p className="mt-2 text-xs font-semibold text-primary">
                    {title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-mango opacity-20 blur-3xl" />

            <img
              src={aboutCollage2}
              alt="Mangoes, groundnuts and cold-pressed groundnut oil"
              className="aspect-square w-full max-w-md rounded-[2rem] object-cover shadow-card"
            />
          </div>
        </div>
      </section>

      {/* Mangoes & Naturals / Shop */}
      <section id="shop" className="bg-cream py-20">
        <div className="container">
          <div className="mb-12 max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">
              Our harvest
            </span>
            <h2 className="mt-3 font-display text-4xl font-bold text-primary sm:text-5xl">
              Mangoes, Oils, Kaju &amp; Dates.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Naturally ripened mangoes and farm-fresh groundnut goodness —
              straight from Andhra. Ships pan-India.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Happy Customers */}
      <section id="testimonials" className="bg-cream py-20">
        <div className="container">
          <div className="mb-12 max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">
              Happy customers
            </span>
            <h2 className="mt-3 font-display text-4xl font-bold text-primary sm:text-5xl">
              Loved across India.
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="rounded-2xl border border-border/60 bg-card p-8 shadow-soft"
              >
                <div className="flex gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-base text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 text-sm font-semibold text-primary">
                  {t.name}{" "}
                  <span className="font-normal text-muted-foreground">
                    · {t.city}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="container py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">
              Contact
            </span>
            <h2 className="font-display text-4xl font-bold text-primary sm:text-5xl text-balance">
              Talk to us. We&apos;d love to hear from you.
            </h2>
            <p className="text-muted-foreground">
              Questions about a box, bulk orders, or a visit to the orchards?
              Reach out — we usually reply the same day.
            </p>
          </div>
          <div className="grid gap-4">
            <a
              href="tel:+919642333337"
              className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-soft transition-colors hover:border-primary"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Call us
                </p>
                <p className="mt-1 font-semibold text-primary">
                  +91 96423 33337
                </p>
              </div>
            </a>
            <a
              href="https://wa.me/919642333337"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-soft transition-colors hover:border-primary"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white">
                <svg
                  viewBox="0 0 32 32"
                  className="h-5 w-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M19.11 17.21c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.21-.62.07-.29-.15-1.22-.45-2.32-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.55-.88-2.12-.23-.55-.46-.48-.64-.49l-.55-.01c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.39 0 1.41 1.02 2.77 1.16 2.96.14.19 2.01 3.07 4.87 4.31.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.12.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM16.04 5.33c-5.91 0-10.71 4.79-10.71 10.7 0 1.89.5 3.74 1.44 5.36L5.33 26.67l5.43-1.42a10.7 10.7 0 0 0 5.27 1.37h.01c5.9 0 10.7-4.79 10.7-10.7s-4.8-10.59-10.7-10.59z" />
                </svg>
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  WhatsApp
                </p>
                <p className="mt-1 font-semibold text-primary">
                  Chat with us · +91 96423 33337
                </p>
              </div>
            </a>
            <a
              href="mailto:anunaturalfoods12@gmail.com"
              className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-soft transition-colors hover:border-primary"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email
                </p>
                <p className="mt-1 font-semibold text-primary">
                  anunaturalfoods12@gmail.com
                </p>
              </div>
            </a>
            <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Visit us
                </p>
                <p className="mt-1 font-semibold text-primary">
                  Madanapalli, Andhra Pradesh, 517325
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
