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
    title: '2026 Luxury Marble Trends',
    slug: '2026-luxury-marble-trends',
    category: 'Design Trends',
    readTime: '2 min read',
    date: 'July 18, 2026',
    author: 'Vikramaditya Sen',
    authorRole: 'Principal Curator, Ashapura Granite',
    summary: 'Discover how top designers use book-matched marble and warm tones to elevate modern luxury homes.',
    content: `Natural stone is the centerpiece of modern luxury interiors. Designers are choosing bold, sculptural slabs with dramatic veining.

1. Book-Matching: Pairing adjacent slabs cut from the same block to mirror each other creates a striking focal point for accent walls and mandirs.
2. Warm Gold Tones: Warm champagne and honey hues are replacing cool grey marbles, adding warmth to drawing rooms.
3. Slim Porcelain: Lightweight, weather-resistant sintered slabs are popular for outdoor balconies and high-rise facades.`,
    image: 'img1.jpeg',
    tags: ['Marble', 'Calacatta', 'Bookmatching', 'Interior Design']
  },
  {
    id: 'quartzite-vs-marble-guide',
    title: 'Quartzite vs. Marble: Kitchen Guide',
    slug: 'quartzite-vs-marble-kitchen-guide',
    category: 'Material Guide',
    readTime: '2 min read',
    date: 'June 24, 2026',
    author: 'Shivam suthar',
    authorRole: 'Senior Petrographer & Quarry Director',
    summary: 'A simple geological guide to choosing the right natural stone for your kitchen countertops.',
    content: `Choosing the right stone for a kitchen island is crucial for both aesthetics and durability.

1. Geology: Quartzite is formed from sandstone under intense heat and pressure, making it much harder than marble.
2. Acid Resistance: Unlike calcite-based marble, quartzite does not etch or react when exposed to acids like lemon juice or vinegar.`,
    image: 'img2.jpeg',
    tags: ['Quartzite', 'Kitchen Countertops', 'Material Science', 'Maintenance']
  },
  {
    id: 'stone-maintenance-masterclass',
    title: 'Stone Maintenance Masterclass',
    slug: 'stone-maintenance-masterclass',
    category: 'Maintenance',
    readTime: '2 min read',
    date: 'May 12, 2026',
    author: 'Bhavesh soni',
    authorRole: 'Master Stone Mason',
    summary: 'Expert tips on cleaning, sealing, and preserving your luxury natural marble and granite surfaces.',
    content: `Proper care preserves the beauty of natural marble and granite for generations.

1. Neutral Cleaners: Avoid acidic cleaners like vinegar. Use pH-neutral stone soaps.
2. Sealing: Apply hydrophobic sealants every 12 to 18 months to protect against stains.
3. Clean Spills: Wipe away acidic liquids immediately with microfibre cloths.`,
    image: 'img3.jpeg',
    tags: ['Stone Care', 'Sealing', 'Marble Maintenance']
  }
];

