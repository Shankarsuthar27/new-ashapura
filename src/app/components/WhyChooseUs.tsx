import React from 'react';
import {
  Award,
  CircleDollarSign,
  Sparkles,
  Truck,
  HeartHandshake,
  Grid
} from 'lucide-react';
import { motion } from 'motion/react';

const FEATURES = [
  {
    icon: Award,
    title: 'Premium Quality Materials',
    description: 'We offer high-quality tiles, granite, marble, and sanitary products sourced from trusted manufacturers to ensure durability and long-lasting performance.'
  },
  {
    icon: CircleDollarSign,
    title: 'Affordable & Competitive Pricing',
    description: 'Get the best value for your money with premium products at reasonable prices, suitable for both residential and commercial projects.'
  },
  {
    icon: Sparkles,
    title: 'Latest Designs & Wide Collection',
    description: 'Explore a vast range of modern, classic, and luxury designs to match every style and space requirement.'
  },
  {
    icon: Grid,
    title: 'Wide Product Range',
    description: 'A large collection of designs, colors, and finishes.'
  },
  {
    icon: Truck,
    title: 'Fast & Reliable Delivery',
    description: 'We ensure timely delivery of products so your construction or renovation project stays on schedule.'
  },
  {
    icon: HeartHandshake,
    title: 'Trusted Customer Service',
    description: 'Our experienced team provides expert guidance, personalized support, and a hassle-free buying experience from selection to delivery.'
  }
];

const COUNTERS = [
  { value: '5,000+', label: 'Products & Slabs in Stock' },
  { value: '10,000+', label: 'Satisfied Luxury Clients' },
  { value: '25+', label: 'Years of Craftsmanship' },
  { value: '50+', label: 'Suppliers Worldwide' }
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-choose-us" className="py-24 bg-[#F8F8F8] dark:bg-[#0E0E11] text-gray-900 dark:text-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#C8A96A] font-bold inline-flex items-center gap-2">
            Ashapura granite
          </span>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl font-bold tracking-tight">
            Ashapura Granite has a large collection of designs.
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base font-sans-luxury">
            Architects & Designers Choose Us.
          </p>
        </div>

        {/* 6 Luxury Icon Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="p-8 rounded-3xl bg-white dark:bg-[#141417] border border-gray-200 dark:border-gray-800 hover:border-[#C8A96A]/50 shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#C8A96A]/10 border border-[#C8A96A]/30 flex items-center justify-center text-[#C8A96A] mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-serif-luxury text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#C8A96A] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Animated Counter Stats Bar */}
        <div className="bg-[#111114] border border-[#C8A96A]/30 rounded-3xl p-8 sm:p-12 shadow-2xl text-white">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {COUNTERS.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="pt-4 lg:pt-0 lg:px-4"
              >
                <span className="font-serif-luxury font-bold text-4xl sm:text-5xl text-[#C8A96A] block mb-2">
                  {stat.value}
                </span>
                <span className="text-xs uppercase tracking-widest text-gray-300 font-semibold font-sans-luxury">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
