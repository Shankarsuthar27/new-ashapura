import { motion } from "motion/react";
import {
  CreditCard,
  Landmark,
  Wallet,
  BadgePercent,
  Building2,
  CircleDollarSign,
} from "lucide-react";

const emiPartners = [
  { name: "Bajaj Finserv", icon: CreditCard, color: "#0076CE" },
  { name: "HDFC Bank", icon: Landmark, color: "#004B8D" },
  { name: "ICICI Bank", icon: Building2, color: "#F58220" },
  { name: "SBI", icon: Landmark, color: "#22409A" },
  { name: "Paytm", icon: Wallet, color: "#00BAF2" },
  { name: "ZestMoney", icon: CircleDollarSign, color: "#6C63FF" },
];

export function EMI() {
  return (
    <section className="mt-14">
      <div className="bg-white rounded-2xl shadow-lg border p-6 sm:p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 mb-2">
            <BadgePercent className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              Easy EMI Options Available
            </h3>
          </div>
          <p className="text-gray-500 text-sm">
            Buy now, pay later with 0% interest EMI from top financial partners
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {emiPartners.map((partner, index) => {
            const Icon = partner.icon;

            return (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border hover:shadow-md transition"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: partner.color }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <span className="text-sm font-medium text-gray-700 text-center">
                  {partner.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}