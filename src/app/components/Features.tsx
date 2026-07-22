import { motion } from 'motion/react';
import { Shield, DollarSign, Truck, Wrench } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Genuine Products',
    description: '100% authentic',
  },
  {
    icon: DollarSign,
    title: 'Best Price Guarantee',
    description: 'Lowest prices',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Express shipping',
  },
  {
    icon: Wrench,
    title: 'Warranty Support',
    description: 'Full service',
  },
];

export function Features() {
  return (
    <div className="relative -mt-24 z-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
