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
  <img  src="floor tile.jpg" alt="" />
);

const WallTilesIcon = () => (
  <img src="wall tile.webp" alt="" />
);

const GraniteIcon = () => (
 <img src="Baghera-Black-Granite.webp" alt="" />
);

const MarbleIcon = () => (
  <img src="China-White.webp" alt="" />
);

const SanitaryIcon = () => (
  <img src="sanitary.webp" alt="" />
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
                className="w-[110px] h-[110px]  bg-[#141414] border border-[#D4A537]/40 group-hover:border-[#D4A537] flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2.5 group-hover:shadow-[0_0_30px_rgba(212,165,55,0.35)] group-hover:bg-[#1A1812]"
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
