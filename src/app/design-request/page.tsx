"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const roomTypes = [
  { value: "Living Room", icon: "🛋️", desc: "Main living area" },
  { value: "Bedroom", icon: "🛏️", desc: "Sleeping quarters" },
  { value: "Kitchen", icon: "🍳", desc: "Cooking space" },
  { value: "Dining Room", icon: "🍽️", desc: "Eating area" },
  { value: "Bathroom", icon: "🛁", desc: "Bath space" },
  { value: "Home Office", icon: "💻", desc: "Work space" },
  { value: "Kids Room", icon: "🧸", desc: "Children's room" },
  { value: "Balcony", icon: "🌿", desc: "Outdoor space" },
];

const styles = [
  "Minimalist",
  "Modern",
  "Bohemian",
  "Scandinavian",
  "Industrial",
  "Traditional",
  "Contemporary",
  "Rustic",
  "Art Deco",
  "Mid-Century Modern",
];

const steps = ["Room Details", "Dimensions & Style", "Description", "Review & Submit"];

export default function DesignRequestPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    address: "",
    roomType: "",
    roomDimensions: "",
    style: "",
    description: "",
    inspirationLink: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.address && formData.roomType;
      case 1: return formData.roomDimensions && formData.style;
      case 2: return formData.description.length >= 20;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/design-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          description: `Style: ${formData.style}\n\n${formData.description}`,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to submit request");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 bg-surface flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-4"
        >
          <div className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-heading font-bold mb-4">Request Submitted!</h1>
          <p className="text-text-muted mb-8">
            Our design team will review your request and get back to you shortly. Track your request in your dashboard.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 rounded-xl gold-gradient text-primary font-semibold hover:opacity-90 transition-all"
            >
              View Dashboard
            </button>
            <button
              onClick={() => router.push("/shop")}
              className="px-6 py-3 rounded-xl border border-accent/30 text-accent font-semibold hover:bg-accent/5 transition-all"
            >
              Browse Shop
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-surface">
      {/* Header */}
      <div className="bg-primary py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-accent text-sm font-semibold tracking-widest uppercase">Design Service</span>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-text-light mt-3 mb-4">
              Custom Room <span className="gold-text">Design</span>
            </h1>
            <p className="text-text-light/50 max-w-lg mx-auto">
              Tell us about your space and style preferences. Our expert designers will craft a personalized plan for you.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-12 px-4">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    i <= currentStep
                      ? "gold-gradient text-primary shadow-lg shadow-accent/20"
                      : "bg-white border-2 border-black/10 text-text-muted"
                  }`}
                >
                  {i < currentStep ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`text-xs mt-2 hidden sm:block ${i <= currentStep ? "text-accent font-medium" : "text-text-muted"}`}>
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 w-12 sm:w-20 mx-2 transition-colors duration-300 ${
                  i < currentStep ? "bg-accent" : "bg-black/10"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl p-8 border border-black/5 shadow-lg"
          >
            {/* Step 0: Room Details */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-2">Your Address</h2>
                  <p className="text-text-muted text-sm mb-4">Where should we design?</p>
                  <textarea
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all resize-none"
                    placeholder="Enter your full address..."
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-2">Select Room Type</h2>
                  <p className="text-text-muted text-sm mb-4">What room do you want to design?</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {roomTypes.map((room) => (
                      <button
                        key={room.value}
                        onClick={() => updateField("roomType", room.value)}
                        className={`p-4 rounded-2xl border-2 text-center transition-all duration-300 hover:shadow-md ${
                          formData.roomType === room.value
                            ? "border-accent bg-accent/5 shadow-md shadow-accent/10"
                            : "border-black/5 hover:border-accent/30"
                        }`}
                      >
                        <div className="text-2xl mb-1">{room.icon}</div>
                        <div className="text-sm font-medium">{room.value}</div>
                        <div className="text-xs text-text-muted mt-0.5">{room.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Dimensions & Style */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-2">Room Dimensions</h2>
                  <p className="text-text-muted text-sm mb-4">Approximate size of your room</p>
                  <input
                    type="text"
                    value={formData.roomDimensions}
                    onChange={(e) => updateField("roomDimensions", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
                    placeholder="e.g., 12x14 ft, 15x20 ft"
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-heading font-bold mb-2">Design Style</h2>
                  <p className="text-text-muted text-sm mb-4">Choose your preferred aesthetic</p>
                  <div className="flex flex-wrap gap-2">
                    {styles.map((style) => (
                      <button
                        key={style}
                        onClick={() => updateField("style", style)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                          formData.style === style
                            ? "gold-gradient text-primary shadow-md shadow-accent/20"
                            : "bg-surface text-text-muted hover:text-accent border border-black/5"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Description */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-2">Describe Your Vision</h2>
                  <p className="text-text-muted text-sm mb-4">
                    Tell us about your current room and what you&apos;d like to change. The more detail, the better!
                  </p>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all resize-none"
                    placeholder="Describe your current room setup, what you like, what you want to change, color preferences, furniture needs, budget range..."
                  />
                  <p className="text-xs text-text-muted mt-2">
                    {formData.description.length}/20 characters minimum
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-heading font-bold mb-2">Inspiration Link (Optional)</h2>
                  <p className="text-text-muted text-sm mb-4">
                    Share a Pinterest board, Google Drive link, or any reference URL
                  </p>
                  <input
                    type="url"
                    value={formData.inspirationLink}
                    onChange={(e) => updateField("inspirationLink", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
                    placeholder="https://pinterest.com/board/..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-heading font-bold mb-4">Review Your Request</h2>
                
                <div className="space-y-4">
                  {[
                    { label: "Address", value: formData.address },
                    { label: "Room Type", value: formData.roomType },
                    { label: "Dimensions", value: formData.roomDimensions },
                    { label: "Style", value: formData.style },
                    { label: "Description", value: formData.description },
                    { label: "Inspiration", value: formData.inspirationLink || "Not provided" },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-xl bg-surface">
                      <span className="text-xs text-accent font-semibold tracking-wider uppercase">
                        {item.label}
                      </span>
                      <p className="text-sm mt-1 whitespace-pre-wrap">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            className={`px-6 py-3 rounded-xl border border-black/10 text-text-muted font-medium hover:text-accent hover:border-accent/30 transition-all ${
              currentStep === 0 ? "opacity-0 pointer-events-none" : ""
            }`}
          >
            ← Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="px-8 py-3 rounded-xl gold-gradient text-primary font-semibold hover:opacity-90 disabled:opacity-40 transition-all shadow-lg shadow-accent/20"
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 rounded-xl gold-gradient text-primary font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-accent/20"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
