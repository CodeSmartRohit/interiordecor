"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductType } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: "easeOut" as const },
  }),
};

const services = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: "Full Room Design",
    desc: "Complete room transformation from concept to reality, tailored to your unique taste.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: "Color Consultation",
    desc: "Expert color palette selection to create the perfect mood and ambiance.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    title: "Space Planning",
    desc: "Maximize your room's potential with intelligent furniture placement and layout.",
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Homeowner, Mumbai",
    text: "Élégance transformed my living room beyond what I imagined. The attention to detail and the curated pieces they selected were absolutely perfect.",
    rating: 5,
  },
  {
    name: "Raj Patel",
    role: "Apartment Owner, Delhi",
    text: "The design team understood my minimalist vision perfectly. My 2BHK now feels like a luxury suite. Highly recommended!",
    rating: 5,
  },
  {
    name: "Ananya Sharma",
    role: "Interior Enthusiast, Bangalore",
    text: "Shopping for home decor has never been easier. The quality of products is exceptional and delivery was prompt.",
    rating: 5,
  },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<ProductType[]>([]);

  useEffect(() => {
    fetch("/api/products?featured=true&limit=4")
      .then((r) => r.json())
      .then((data) => setFeatured(data.products || []))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary">
        {/* Background Patterns */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-surface-dark" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-accent/5 blur-[120px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-accent/3 blur-[100px] translate-y-1/2 -translate-x-1/3" />
          {/* Decorative Grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(rgba(201,169,110,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.3) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }} />
        </div>

        <div className="relative z-10 max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 text-accent text-sm font-medium mb-8 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Premium Interior Design Studio
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-text-light leading-[1.1] mb-8"
              >
                Design Your
                <br />
                <span className="gold-text">Dream Space</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg text-text-light/60 max-w-lg mb-10 leading-relaxed"
              >
                Transform your living spaces with curated design expertise and handpicked decor. 
                From personalized room designs to premium home accessories.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/design-request"
                  className="px-8 py-4 rounded-2xl gold-gradient text-primary font-semibold text-base hover:opacity-90 transition-all duration-300 shadow-xl shadow-accent/20 pulse-glow"
                >
                  Start Your Design
                </Link>
                <Link
                  href="/shop"
                  className="px-8 py-4 rounded-2xl border border-accent/30 text-accent font-semibold text-base hover:bg-accent/10 transition-all duration-300"
                >
                  Browse Collection
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex gap-10 mt-14"
              >
                {[
                  { value: "500+", label: "Projects Done" },
                  { value: "200+", label: "Happy Clients" },
                  { value: "50+", label: "Design Awards" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-3xl font-heading font-bold text-accent">{stat.value}</div>
                    <div className="text-sm text-text-light/40 mt-1">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="hidden lg:block relative"
            >
              <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                <div className="absolute inset-0 rounded-[40px] gold-gradient opacity-10 rotate-6" />
                <div className="absolute inset-0 rounded-[40px] overflow-hidden border border-accent/20 bg-secondary/50 backdrop-blur-sm">
                  <img
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=600&fit=crop"
                    alt="Modern luxury interior"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                </div>
                {/* Floating Card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const }}
                  className="absolute -bottom-6 -left-6 glass-dark rounded-2xl p-4 shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-text-light text-sm font-semibold">Design Complete</div>
                      <div className="text-text-light/40 text-xs">Living Room • Modern</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-accent/30 flex justify-center pt-2">
            <div className="w-1 h-3 rounded-full bg-accent/60" />
          </div>
        </motion.div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="py-32 lg:py-40 bg-surface relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px] -translate-x-1/2" />
        <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.span variants={fadeUp} custom={0} className="text-accent text-sm font-semibold tracking-widest uppercase">
              Our Services
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mt-6 mb-8">
              Crafting Beautiful <span className="gold-text">Interiors</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
              From initial concept to final styling, our expert design team brings your vision to life with meticulous attention to detail.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10 lg:gap-12">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -8 }}
                className="group p-10 lg:p-12 rounded-[2.5rem] bg-white border border-black/5 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4">{service.title}</h3>
                <p className="text-text-muted leading-[1.8] text-lg">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-32 lg:py-40 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px] translate-x-1/3" />
        <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-20 gap-8"
          >
            <div>
              <motion.span variants={fadeUp} custom={0} className="text-accent text-sm font-semibold tracking-widest uppercase">
                Curated Collection
              </motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-text-light mt-6">
                Featured <span className="gold-text">Products</span>
              </motion.h2>
            </div>
            <motion.div variants={fadeUp} custom={2}>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-accent hover:text-accent-light transition-colors font-medium text-lg pb-2 border-b-2 border-transparent hover:border-accent"
              >
                View All Products
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {featured.map((product, i) => (
              <motion.div
                key={product.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6 }}
              >
                <Link href={`/shop/${product.id}`} className="group block">
                  <div className="rounded-2xl overflow-hidden bg-secondary/50 border border-white/5">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-5">
                      <span className="text-xs text-accent/70 font-medium tracking-wider uppercase">
                        {product.category}
                      </span>
                      <h3 className="text-text-light font-heading font-semibold mt-1 mb-2 group-hover:text-accent transition-colors">
                        {product.title}
                      </h3>
                      <div className="text-accent text-lg font-bold">
                        ${product.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="pt-40 pb-32 lg:pt-48 lg:pb-40 bg-surface relative">
        <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.span variants={fadeUp} custom={0} className="text-accent text-sm font-semibold tracking-widest uppercase">
              Testimonials
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mt-6">
              What Our Clients <span className="gold-text">Say</span>
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10 lg:gap-12">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="p-10 lg:p-12 rounded-[2.5rem] bg-white border border-black/5 shadow-xl shadow-black/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-8">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <svg key={j} className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-text-muted leading-[1.8] text-lg mb-10 italic">&ldquo;{t.text}&rdquo;</p>
                </div>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center text-primary font-bold text-xl">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{t.name}</div>
                    <div className="text-text-muted text-sm">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-40 lg:py-56 bg-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/5 blur-[150px]" />
        </div>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 relative text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center gap-12"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-text-light leading-[1.1]">
              Ready to Transform
              <br />
              <span className="gold-text">Your Space?</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-xl text-text-light/60 max-w-3xl mx-auto leading-relaxed">
              Tell us about your room and let our experts craft a personalized design plan just for you. No commitments, just beautiful possibilities.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link
                href="/design-request"
                className="inline-flex items-center gap-4 px-12 py-6 rounded-full gold-gradient text-primary font-bold text-xl hover:opacity-90 transition-all duration-300 shadow-2xl shadow-accent/30 pulse-glow"
              >
                Request Your Design
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
