"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/cart/CartProvider";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isAdmin = session?.user?.role === "ADMIN";
  const isHome = pathname === "/";

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/design-request", label: "Design Service" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isHome
            ? "bg-primary/95 backdrop-blur-xl shadow-2xl shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-primary font-bold text-lg font-heading group-hover:scale-110 transition-transform duration-300">
                É
              </div>
              <span className="text-xl font-heading font-bold text-text-light tracking-wide">
                Élégance
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium tracking-wide transition-colors duration-300 ${
                    pathname === link.href
                      ? "text-accent"
                      : "text-text-light/80 hover:text-accent-light"
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 gold-gradient rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="hidden md:flex items-center gap-4">
              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-xl text-text-light/80 hover:text-accent transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full gold-gradient text-primary text-xs font-bold flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>

              {session ? (
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="text-sm font-medium text-accent hover:text-accent-light transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-text-light/80 hover:text-accent-light transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 rounded-xl text-sm font-medium border border-accent/30 text-accent hover:bg-accent hover:text-primary transition-all duration-300"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-text-light/80 hover:text-accent-light transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold gold-gradient text-primary hover:opacity-90 transition-all duration-300 shadow-lg shadow-accent/20"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-text-light"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-primary/98 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-2xl font-heading font-semibold ${
                    pathname === link.href ? "text-accent" : "text-text-light/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/cart" className="text-2xl font-heading font-semibold text-text-light/80">
                Cart {totalItems > 0 && `(${totalItems})`}
              </Link>
              <hr className="border-accent/20" />
              {session ? (
                <>
                  {isAdmin && (
                    <Link href="/admin" className="text-lg text-accent">Admin Panel</Link>
                  )}
                  <Link href="/dashboard" className="text-lg text-text-light/80">Dashboard</Link>
                  <button onClick={() => signOut()} className="text-lg text-text-light/60 text-left">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-lg text-text-light/80">Sign In</Link>
                  <Link href="/register" className="text-lg text-accent">Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
