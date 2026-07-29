export interface StoneSlab {
  id: string;
  name: string;
  category: 'Floor Tiles' | 'Wall Tiles' | 'Granite' | 'Marble' | 'Sanitary Items' | string;
  color: string;
  origin: string;
  finishes: string[];
  dimensions: string; // e.g. "3200 x 1950 x 20 mm"
  thickness: string; // e.g. "20 mm / 30 mm"
  priceTier: '$$' | '$$$$' | '$$$$$';
  inStockSlabs: number;
  bundleNumber: string;
  rarity: 'Rare Collection' | 'Signature' | 'Heritage' | 'Exclusive Quarry';
  description: string;
  longDescription: string;
  image: string;
  bookmatchImage?: string;
  applications: string[];
  featured?: boolean;
  price?: number;
  unit?: string;
  specifications: {
    compressiveStrength: string;
    waterAbsorption: string;
    density: string;
    flexuralStrength: string;
  };
}


export interface StoneCategory {
  id: string;
  name: 'Floor Tiles' | 'Wall Tiles' | 'Granite' | 'Marble' | 'Sanitary Items' | string;
  tagline: string;
  description: string;
  image: string;
  count: number;
  keyFeatures: string[];
}

export interface Showroom {
  id: string;
  city: string;
  title: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapEmbedUrl: string;
  image: string;
  coordinates: { lat: number; lng: number };
  virtualTourAvailable: boolean;
}

export interface ProcessStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  details: string[];
  icon: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  clientName: string;
  clientTitle: string;
  firm: string;
  rating: number;
  image: string;
  projectPhoto: string;
  materialPurchased: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  summary: string;
  content: string;
  image: string;
  tags: string[];
}

export const STONE_CATEGORIES: StoneCategory[] = [
  {
    id: 'floor-tiles',
    name: 'Floor Tiles',
    tagline: 'Precision Vitrified Floor Surfaces',
    description: 'Best Floor Tiles Available',
    image: './t1.jpeg',
    count: 140,
    keyFeatures: []
  },
  {
    id: 'wall-tiles',
    name: 'Wall Tiles',
    tagline: 'Artisan Ceramic & Decor Walls',
    description: 'Hand-glazed Moroccan zellige wall tiles, 3D ceramic accents, and high-gloss feature wall tiles designed for kitchens and bathrooms.',
    image: './tiles.jpg',
    count: 115,
    keyFeatures: []
  },
  {
    id: 'granite',
    name: 'Granite',
    tagline: 'Unyielding Geological Strength',
    description: 'All Types of Granites in best quality',
    image: './m1.jpeg',
    count: 98,
    keyFeatures: []
  },
  {
    id: 'marble',
    name: 'Marble',
    tagline: 'Timeless Italian & Greek Elegance',
    description: 'All Types of Marbles',
    image: './g1.jpeg',
    count: 124,
    keyFeatures: []
  },
  {
    id: 'sanitary-items',
    name: 'Sanitary Items',
    tagline: 'Luxury Showroom Sanitaryware & Fixtures',
    description: 'All Sanitary items',
    image: './s.jpeg',
    count: 85,
    keyFeatures: []
  }
];

export const SLABS_DATA: StoneSlab[] = [];

export const SHOWROOM_LOCATIONS: Showroom[] = [
  {
    id: 'Sirohi',
    city: 'Kalandari,Sirohi',
    title: 'Ashapura tiles & Granite',
    address: 'Bhadriya Colony, Barloot Road, Kalandari, Sirohi (Rajasthan)',
    phone: '+919974617657',
    email: 'ny.showroom@aureliamarmi.com',
    hours: '9:00 AM - 9:00 PM',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4707.7037408102!2d72.68602150894596!3d24.934680330458725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3943210077910b65%3A0x2247d600dd5e0d89!2sASHAPURA%20GRANITE%20%26%20TILES!5e0!3m2!1sen!2sin!4v1784791866363!5m2!1sen!2sin',
    image: './main.jpeg',
    coordinates: { lat: 24.9346803, lng: 72.6860215 },
    virtualTourAvailable: true
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Browse & Select Slabs',
    subtitle: 'Explore High-Definition Slab Inventory',
    description: 'Browse our curated slab gallery online or tour our gallery in person. View real-time slab bundle numbers, dimensions, and natural veining pattern variations.',
    duration: 'Step 1 of 5',
    details: ['Interactive 3D Visualizer preview', 'Real-time slab availability check', 'Dedicated stone consultant assigned'],
    icon: 'Compass'
  },
  {
    number: '02',
    title: 'Request Complimentary Samples',
    subtitle: 'Delivered in Luxury Presentation Box',
    description: 'Receive 4"x4" real stone sample chips polished to your specified finish directly to your design studio or residential project within 48 hours.',
    duration: '48 Hour Express',
    details: ['Includes polished, honed & leathered samples', 'Sealant & stain testing swatch', 'Custom architectural spec sheet'],
    icon: 'PackageCheck'
  },
  {
    number: '03',
    title: 'Architectural Consultation',
    subtitle: 'Book-Matching & Slab Layout Rendering',
    description: 'Collaborate with our master stone consultants and CAD engineers to map your project template digitally across your chosen slab bundles for flawless book-matching.',
    duration: 'Design Alignment',
    details: ['Digital CAD slab layout overlay', 'Book-match vein alignment preview', 'Quarry block reservation lock'],
    icon: 'Compass'
  },
  {
    number: '04',
    title: 'Precision Waterjet Fabrication',
    subtitle: 'Italian 5-Axis CNC Craftsmanship',
    description: 'Your slabs are precision-cut using ultra-high pressure waterjet technology and hand-finished by master stone masons in our state-of-the-art facility.',
    duration: '7 - 10 Days',
    details: ['Sub-millimeter edge detailing', 'Mitred waterfall edge profiling', 'Factory anti-stain nano-sealing'],
    icon: 'Hammer'
  },
  {
    number: '05',
    title: 'White-Glove Installation',
    subtitle: 'Certified Master Stone Craftsmen',
    description: 'Our in-house master installation team delivers, places, and seamlessly bonds your custom stone features with lifetime warranty backing.',
    duration: 'Final Delivery',
    details: ['Climate-controlled transport', 'Zero-seam color matched epoxies', 'Post-installation care package'],
    icon: 'ShieldCheck'
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 't-1',
    quote: 'Aurelia Marmi provided four consecutive book-matched slabs of Calacatta Gold for our penthouse waterfall island. The vein continuity was flawless—an absolute work of art.',
    clientName: 'Julian Thorne',
    clientTitle: 'Principal Architect',
    firm: 'Thorne & Associates Architecture, NY',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    projectPhoto: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    materialPurchased: 'Calacatta Gold Oro Extra'
  },
  {
    id: 't-2',
    quote: 'When designing a 5-star spa in Mayfair, stone durability and translucent beauty were non-negotiable. Taj Mahal Quartzite from Aurelia exceeded every standard.',
    clientName: 'Elena Rostova',
    clientTitle: 'Senior Interior Designer',
    firm: 'Rostova Design Atelier, London',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    projectPhoto: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    materialPurchased: 'Taj Mahal Quartzite Royal'
  },
  {
    id: 't-3',
    quote: 'The level of service from quarry selection to white-glove installation is unrivaled. They sourced a rare batch of Amazonite Quartzite for our bar project seamlessly.',
    clientName: 'Marcus Vance',
    clientTitle: 'Luxury Estate Developer',
    firm: 'Vance Capital Properties, Beverly Hills',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    projectPhoto: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    materialPurchased: 'Amazonite Emerald Quartzite'
  }
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'marble-trends-2026',
    title: '2026 Luxury Marble Trends: Indian Book-Matched Veining & Premium Calacatta Gold',
    slug: '2026-luxury-marble-trends',
    category: 'Design Trends',
    readTime: '6 min read',
    date: 'July 18, 2026',
    author: 'Vikramaditya Sen',
    authorRole: 'Principal Curator, Ashapura Granite',
    summary: 'Discover how top interior designers are deploying dramatic book-matched marble slabs to turn modern Indian bungalows and penthouses into monolithic stone sanctuaries.',
    content: `Natural stone has evolved from a utilitarian countertop material into the centerpiece of luxury interior design in Indian bungalows and high-end apartments. As we progress through 2026, the preference in major cities like Mumbai, Delhi NCR, and Bangalore has shifted dramatically toward bold, sculptural stone selections with high-contrast veining.

1. The Renaissance of Book-Matching
Book-matching involves pairing adjacent slabs cut from the exact same marble block so that their veining mirrors each other like an open book. This technique is highly favored for premium home mandirs, lobby double-height accent walls, and living room floor spreads across luxury estates in Rajasthan and Delhi.

2. Warm Gold Veining Over Monochromatic Grey
While cool grey Statuario dominated luxury Indian residential projects in the previous decade, warm honey and champagne tones—exemplified by Calacatta Gold Oro Extra—are now taking center stage, adding an organic, sun-washed warmth to premium drawing rooms.

3. Sintered Ultra-Thin Porcelain Facades
Architects are increasingly incorporating lightweight porcelain sintered slabs into outdoor terrace lounges and high-rise apartment exterior balconies in Mumbai and Bangalore for zero-fading endurance against severe tropical monsoons.`,
    image: 'img1.jpeg',
    tags: ['Marble', 'Calacatta', 'Bookmatching', 'Interior Design']
  },
  {
    id: 'quartzite-vs-marble-guide',
    title: 'Quartzite vs. Marble: Choosing the Right Exotic Stone for Your Kitchen',
    slug: 'quartzite-vs-marble-kitchen-guide',
    category: 'Material Guide',
    readTime: '8 min read',
    date: 'June 24, 2026',
    author: 'Shivam suthar',
    authorRole: 'Senior Petrographer & Quarry Director',
    summary: 'Understanding the geological differences between metamorphic marble and quartzite to choose stone that balances delicate beauty with heavy culinary utility.',
    content: `Choosing between natural marble and quartzite for a high-traffic kitchen island is one of the most critical decisions in high-end residential architectural projects.

The Geology of Quartzite
Unlike marble, which is composed primarily of calcium carbonate, quartzite originates as pure quartz sandstone that undergoes intense tectonic heat and pressure. The result is a stone rated 7 on the Mohs hardness scale—harder than steel knife blades.

Acid Resistance & Etching
Marble reacts with lemons, wine, and acidic vinegar, requiring periodic sealant maintenance. Quartzite, by contrast, is completely chemically inert to culinary acids, preserving its factory polish effortlessly.`,
    image: 'img2.jpeg',
    tags: ['Quartzite', 'Kitchen Countertops', 'Material Science', 'Maintenance']
  },
  {
    id: 'stone-maintenance-masterclass',
    title: 'The Ultimate Stone Maintenance Masterclass: Preserving Luster & Vein Depth',
    slug: 'stone-maintenance-masterclass',
    category: 'Maintenance',
    readTime: '5 min read',
    date: 'May 12, 2026',
    author: 'Bhavesh soni',
    authorRole: 'Master Stone Mason',
    summary: 'Expert techniques used by museum stone conservators to clean, seal, and polish luxury natural marble and exotic granite surfaces.',
    content: `Proper care ensures natural marble and granite age gracefully over centuries. Here is our master stone care protocol.

1. pH-Neutral Cleaners Only : Never use ammonia, bleach, or vinegar on natural calcite marble. Always use specialized pH-neutral stone soaps.
2. Penetrating Hydrophobic Sealers: Apply fluoropolymer sealers once every 12 to 18 months to create a microscopic barrier against oil and water stains.
3. Prompt Spill Cleanup: Wipe up wine, coffee, or citrus drips immediately using soft microfiber cloths.`,
    image: 'img3.jpeg',
    tags: ['Stone Care', 'Sealing', 'Marble Maintenance']
  }
];
