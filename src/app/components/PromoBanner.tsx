import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export function PromoBanner() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-orange-500 to-emerald-600 rounded-3xl p-12 md:p-16 overflow-hidden shadow-2xl"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                <span className="text-yellow-300 font-semibold uppercase tracking-wide text-sm">
                  Special Offer
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                From Budget to Premium,<br />Find Your Perfect Device
              </h2>
              <p className="text-xl text-white/90 mb-6">
                Exclusive deals on top brands • Free shipping • Easy returns
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-orange-600 px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
            >
              Explore Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
