import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-text-light/70 border-t border-white/5">
      <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Main Footer */}
        <div className="py-20 lg:py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-primary font-bold text-lg font-heading">
                É
              </div>
              <span className="text-xl font-heading font-bold text-text-light tracking-wide">
                Élégance
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Premium interior design services and curated home decor. Transform your space into a sanctuary of style and comfort.
            </p>
            <div className="flex gap-4">
              {["Instagram", "Pinterest", "Facebook"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-xl border border-accent/20 flex items-center justify-center text-accent/60 hover:bg-accent hover:text-primary transition-all duration-300"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-accent font-heading font-semibold mb-8 text-lg">Quick Links</h4>
            <ul className="space-y-5">
              {[
                { href: "/shop", label: "Shop Collection" },
                { href: "/design-request", label: "Design Services" },
                { href: "/shop?category=Furniture", label: "Furniture" },
                { href: "/shop?category=Lighting", label: "Lighting" },
                { href: "/shop?category=Decor", label: "Home Decor" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base leading-relaxed hover:text-accent transition-colors duration-300 flex items-center gap-3 mb-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-accent/40" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-accent font-heading font-semibold mb-8 text-lg">Services</h4>
            <ul className="space-y-5">
              {[
                "Room Consultation",
                "Full Room Design",
                "Color Consultation",
                "Space Planning",
                "Styling & Staging",
              ].map((service) => (
                <li key={service}>
                  <span className="text-base leading-relaxed flex items-center gap-3 mb-1">
                    <span className="w-1 h-1 rounded-full bg-accent/40" />
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-accent font-heading font-semibold mb-8 text-lg">Get In Touch</h4>
            <ul className="space-y-6">
              <li className="text-base leading-relaxed flex items-start gap-3">
                <svg className="w-5 h-5 text-accent/60 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                123 Design Avenue, Creative District, Mumbai 400001
              </li>
              <li className="text-base leading-relaxed flex items-center gap-3">
                <svg className="w-5 h-5 text-accent/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                hello@elegance-decor.com
              </li>
              <li className="text-base leading-relaxed flex items-center gap-3">
                <svg className="w-5 h-5 text-accent/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +91 98765 43210
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-light/40">
            © 2024 Élégance Interior Design. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-text-light/40">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-accent transition-colors">Shipping Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
