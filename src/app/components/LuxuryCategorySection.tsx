import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

export interface CategoryItem {
  id: string;
  name: string;
  link: string;
  icon: React.ReactNode;
}

// Custom line-art gold icons tailored for luxury tiles, marble, granite & sanitaryware
const FloorTilesIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    stroke="#D4A537"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="6" y="6" width="36" height="36" rx="3" />
    <line x1="24" y1="6" x2="24" y2="42" />
    <line x1="6" y1="24" x2="42" y2="24" />
    <rect x="11" y="11" width="8" height="8" rx="1" strokeWidth="1.2" opacity="0.6" />
    <rect x="29" y="29" width="8" height="8" rx="1" strokeWidth="1.2" opacity="0.6" />
  </svg>
);

const WallTilesIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    stroke="#D4A537"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="6" y="6" width="36" height="36" rx="3" />
    {/* Brick Wall Grid Lines */}
    <line x1="6" y1="18" x2="42" y2="18" />
    <line x1="6" y1="30" x2="42" y2="30" />
    <line x1="20" y1="6" x2="20" y2="18" />
    <line x1="32" y1="18" x2="32" y2="30" />
    <line x1="16" y1="30" x2="16" y2="42" />
  </svg>
);

const GraniteIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    stroke="#D4A537"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Granite Slab & Crystal Minerals */}
    <path d="M10 38 L38 38 L42 16 L14 16 Z" />
    <path d="M14 16 L24 8 L42 16" />
    <line x1="10" y1="38" x2="14" y2="16" />
    {/* Mineral crystalline facets */}
    <path d="M22 24 L27 20 L32 26 L26 31 Z" strokeWidth="1.2" opacity="0.8" />
    <circle cx="18" cy="30" r="1.5" fill="#D4A537" opacity="0.7" />
    <circle cx="34" cy="20" r="1.5" fill="#D4A537" opacity="0.7" />
  </svg>
);

const MarbleIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    stroke="#D4A537"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Marble Slab Frame */}
    <rect x="8" y="8" width="32" height="32" rx="4" />
    {/* Organic Organic Marble Veins */}
    <path d="M12 14 C 18 18, 22 12, 28 20 C 34 28, 26 34, 36 36" />
    <path d="M8 28 C 14 24, 18 30, 24 28 C 30 26, 32 18, 40 14" opacity="0.6" strokeWidth="1.3" />
  </svg>
);

const SanitaryIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    stroke="#D4A537"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Luxury Freestanding Bathtub / Sanitaryware */}
    <path d="M8 22 C 8 32, 16 36, 24 36 C 32 36, 40 32, 40 22 L 40 18 L 8 18 Z" />
    <path d="M6 18 L 42 18" strokeWidth="2.2" />
    {/* Legs */}
    <line x1="14" y1="36" x2="12" y2="42" />
    <line x1="34" y1="36" x2="36" y2="42" />
    {/* Faucet & Water droplets */}
    <path d="M34 18 L 34 10 C 34 8, 30 8, 30 10" strokeWidth="1.5" />
    <circle cx="28" cy="14" r="1" fill="#D4A537" opacity="0.8" />
  </svg>
);

const CATEGORIES: CategoryItem[] = [
  {
    id: 'floor-tiles',
    name: 'FLOOR TILES',
    link: '/products?category=Floor+Tiles',
    icon: <FloorTilesIcon />
  },
  {
    id: 'wall-tiles',
    name: 'WALL TILES',
    link: '/products?category=Wall+Tiles',
    icon: <WallTilesIcon />
  },
  {
    id: 'granite',
    name: 'GRANITE',
    link: '/products?category=Granite',
    icon: <GraniteIcon />
  },
  {
    id: 'marble',
    name: 'MARBLE',
    link: '/products?category=Marble',
    icon: <MarbleIcon />
  },
  {
    id: 'sanitary-items',
    name: 'SANITARY ITEMS',
    link: '/products?category=Sanitary+Items',
    icon: <SanitaryIcon />
  }
];

export const LuxuryCategorySection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#0F0F0F] py-[80px] w-full relative overflow-hidden select-none border-y border-[#D4A537]/15">
      {/* Background Subtle Ambient Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D4A537]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Category Cards Layout: 5 items in a horizontal row on desktop, 2 per row on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 lg:gap-[48px] justify-items-center items-start">
          {CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => navigate(cat.link)}
              className="group cursor-pointer flex flex-col items-center justify-center text-center transition-all duration-300"
            >
              {/* 110px x 110px Square Container with 16px Rounded Radius & Gold Border */}
              <div
                className="w-[110px] h-[110px] rounded-[16px] bg-[#141414] border border-[#D4A537]/40 group-hover:border-[#D4A537] flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2.5 group-hover:shadow-[0_0_30px_rgba(212,165,55,0.35)] group-hover:bg-[#1A1812]"
              >
                <div className="transition-transform duration-300 group-hover:scale-110">
                  {cat.icon}
                </div>
              </div>

              {/* Category Label: White Uppercase Text, Medium Bold, 16px gap below icon */}
              <span className="mt-[16px] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase group-hover:text-[#D4A537] transition-colors duration-300">
                {cat.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LuxuryCategorySection;
