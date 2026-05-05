import anuLogo from "@/assets/anu-logo.png";

const Footer = () => (
  <footer className="mt-24 border-t border-border/60 bg-primary text-primary-foreground">
    <div className="container grid gap-10 py-16 md:grid-cols-3">
      <div>
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-background p-4">
            <img
              src={anuLogo}
              alt="Anu Natural Foods"
              className="h-16 w-auto object-contain"
            />
          </div>
        </div>
        <br />
        <p className="font-display text-2xl font-bold text-secondary">
          Reddivary groups
        </p>
        <p className="mt-4 max-w-xs text-sm text-primary-foreground/80">
          Naturally ripened mangoes, sourced directly from family-owned orchards
          across India. No pesticides. No carbide. Just sunshine and patience.
        </p>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary">
          Shop
        </h4>
        <ul className="mt-3 space-y-2 text-sm text-primary-foreground/80">
          <li>
            <a href="/#shop" className="hover:text-secondary">
              All mango varieties
            </a>
          </li>
          <li>
            <a href="/#shop" className="hover:text-secondary">
              Bestsellers
            </a>
          </li>
          <li>
            <a href="/#shop" className="hover:text-secondary">
              Premium boxes
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary">
          Contact
        </h4>
        <ul className="mt-3 space-y-2 text-sm text-primary-foreground/80">
          <li>anunaturalfoods12@gmail.com</li>
          <li>
            <a href="tel:+919642333337" className="hover:text-secondary">
              +91 96423 33337
            </a>
          </li>
          <li>
            <a
              href="https://wa.me/919642333337"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-secondary"
            >
              WhatsApp: +91 96423 33337
            </a>
          </li>
          <li>Madanapalli, Andhra Pradesh, 517325</li>
          <li>Mon–Sat, 9am–7pm IST</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-primary-foreground/10 py-6 text-center text-xs text-primary-foreground/60">
      © {new Date().getFullYear()} Reddivary. Grown with care.
    </div>
  </footer>
);

export default Footer;
