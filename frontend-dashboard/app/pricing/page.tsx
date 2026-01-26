"use client";

import { PricingTable } from '@clerk/nextjs';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Payment = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Check if user has an active subscription
      // This checks the user's publicMetadata for subscription status
      const subscriptionStatus = user.publicMetadata?.subscriptionStatus as string | undefined;
      const isSubscribed = subscriptionStatus === 'active' || subscriptionStatus === 'trialing';
      
      if (isSubscribed) {
        router.push('/dashboard');
      }
    }
  }, [isLoaded, user, router]);

  // Show loading state while checking auth and subscription
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <div className="text-slate-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="cosmic-bg fixed inset-0 -z-10">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="mesh-grid" />
      </div>

      {/* Header */}
      <header className="relative z-20 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white text-xl font-bold">TSI Automations</span>
            <span className="text-cyan-400 text-xs tracking-wider uppercase">The Sales Inc.</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Choose Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Plan
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Select the perfect plan to unlock the full power of TSI Automations
          </p>
        </motion.div>

        {/* Pricing Table Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-8 md:p-12 rounded-3xl border border-white/5 max-w-6xl mx-auto"
        >
          <PricingTable
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent border-0 shadow-none",
                pricingCard: "glass-card border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300",
                pricingCardHeader: "mb-6",
                pricingCardTitle: "text-white text-2xl font-bold mb-2",
                pricingCardDescription: "text-slate-400 text-sm mb-4",
                pricingCardPrice: "text-cyan-400 text-3xl font-extrabold mb-2",
                pricingCardPriceAmount: "text-cyan-400",
                pricingCardPriceInterval: "text-slate-500 text-sm",
                pricingCardFeatures: "space-y-3 mb-6",
                pricingCardFeature: "text-slate-300 text-sm flex items-center gap-2",
                pricingCardFeatureIcon: "text-cyan-400 w-5 h-5",
                pricingCardButton: "w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40",
                pricingCardButtonActive: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700",
                table: "w-full",
                tableHeader: "bg-white/5 border-b border-white/10",
                tableHeaderCell: "text-slate-300 font-semibold px-6 py-4 text-left",
                tableBody: "divide-y divide-white/5",
                tableRow: "hover:bg-white/5 transition-colors",
                tableCell: "px-6 py-4 text-slate-300",
                tableCellFeature: "flex items-center gap-2",
                tableCellFeatureIcon: "text-cyan-400 w-5 h-5",
                badge: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-semibold",
              },
            }}
          />
        </motion.div>
      </main>
    </div>
  );
};

export default Payment;