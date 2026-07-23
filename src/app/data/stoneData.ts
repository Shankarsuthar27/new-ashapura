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
    keyFeatures: ['Stain & Scratch Proof', 'Vitrified Body Strength', 'Ideal for Living Rooms & Entrances']
  },
  {
    id: 'wall-tiles',
    name: 'Wall Tiles',
    tagline: 'Artisan Ceramic & Decor Walls',
    description: 'Hand-glazed Moroccan zellige wall tiles, 3D ceramic accents, and high-gloss feature wall tiles designed for kitchens and bathrooms.',
    image: './tiles.jpg',
    count: 115,
    keyFeatures: ['Glazed Color Depth', 'Water & Steam Impervious', 'Accent Walls & Backsplashes']
  },
  {
    id: 'granite',
    name: 'Granite',
    tagline: 'Unyielding Geological Strength',
    description: 'All Types of Granites in best quality',
    image: './m1.jpeg',
    count: 98,
    keyFeatures: ['Scratch & Heat Resistant', 'Zero Water Permeability', 'High-Traffic Kitchen Countertops']
  },
  {
    id: 'marble',
    name: 'Marble',
    tagline: 'Timeless Italian & Greek Elegance',
    description: 'All Types of Marbles',
    image: './g1.jpeg',
    count: 124,
    keyFeatures: ['Distinctive Veining', 'High Polish Luster', 'Ideal for Master Suites & Feature Walls']
  },
  {
    id: 'sanitary-items',
    name: 'Sanitary Items',
    tagline: 'Luxury Showroom Sanitaryware & Fixtures',
    description: 'All Sanitary items',
    image: './s.jpeg',
    count: 85,
    keyFeatures: ['Antibacterial Glaze', 'Ultra-Quiet Flushing', 'Ergonomic Architectural Design']
  }
];

export const SLABS_DATA: StoneSlab[] = [
  {
    id: 'royal-carving-vitrified-tile',
    name: 'Royal Statuario Carving Vitrified Floor Tile',
    category: 'Floor Tiles',
    color: 'White & Grey Vein',
    origin: 'Castellón, Spain',
    finishes: ['Polished', 'Honed', 'Fluted'],
    dimensions: '1200 x 1800 x 9 mm',
    thickness: '9 mm / 12 mm',
    priceTier: '$$$',
    inStockSlabs: 150,
    bundleNumber: 'SP-TL-401',
    rarity: 'Signature',
    description: 'Ultra-HD digital carving finish replicating authentic Italian marble with non-porous vitrified backing.',
    longDescription: 'Engineered in Spain using advanced 3D inkjet digital printing and diamond carving technology. Offers the dramatic visual elegance of Statuario marble with effortless cleaning, zero water absorption, and high impact resistance for high-footfall luxury living rooms and spa bathrooms.',
    image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1400&q=90',
    applications: ['Flooring', 'Bathroom Wall', 'Kitchen Countertops'],
    featured: true,
    specifications: {
      compressiveStrength: '220 MPa',
      waterAbsorption: '< 0.05%',
      density: '2.45 g/cm³',
      flexuralStrength: '45 MPa'
    }
  },
  {
    id: 'moroccan-azure-ceramic-tile',
    name: 'Artisan Moroccan Azure Wall Tile',
    category: 'Wall Tiles',
    color: 'Deep Cobalt & Emerald',
    origin: 'Fes, Morocco / Valencia, Spain',
    finishes: ['Polished'],
    dimensions: '300 x 300 x 10 mm',
    thickness: '10 mm',
    priceTier: '$$$$',
    inStockSlabs: 85,
    bundleNumber: 'MA-TL-809',
    rarity: 'Rare Collection',
    description: 'Hand-glazed zellige-style ceramic accent tile featuring iridescent color depth and unique edge beveling.',
    longDescription: 'Crafted with traditional terracotta clay bases glazed with metallic mineral pigments. Each tile possesses subtle organic color variation that creates dynamic light reflection across kitchen backsplashes, shower niches, and bar accent walls.',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1400&q=90',
    applications: ['Bathroom Wall', 'Feature Wall', 'Exterior'],
    featured: true,
    specifications: {
      compressiveStrength: '180 MPa',
      waterAbsorption: '< 0.5%',
      density: '2.30 g/cm³',
      flexuralStrength: '38 MPa'
    }
  },
  {
    id: 'calacatta-gold-extravaganza',
    name: 'Calacatta Gold Oro Extra',
    category: 'Marble',
    color: 'White & Gold',
    origin: 'Carrara, Tuscany, Italy',
    finishes: ['Polished', 'Honed', 'Leathered', 'Fluted'],
    dimensions: '3350 x 1980 x 20 mm',
    thickness: '20 mm / 30 mm',
    priceTier: '$$$$$',
    inStockSlabs: 42,
    bundleNumber: 'IT-CAL-904',
    rarity: 'Rare Collection',
    description: 'Crisp alabaster background adorned with sweeping ribbons of honey-gold and warm grey charcoal veining.',
    longDescription: 'Directly harvested from the premier Apuan Alps quarry in Carrara, Calacatta Gold Oro Extra represents the pinnacle of Italian stone quarrying. Each slab exhibits bold, feather-like veining flowing gracefully across a luminous white calcite field.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=90',
    bookmatchImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=90',
    applications: ['Kitchen Island', 'Bathroom Vanity', 'Fireplace Surround', 'Accent Wall'],
    featured: true,
    specifications: {
      compressiveStrength: '128 MPa',
      waterAbsorption: '0.12%',
      density: '2.71 g/cm³',
      flexuralStrength: '14.2 MPa'
    }
  },
  {
    id: 'statuario-classico-monumental',
    name: 'Statuario Classico Imperial',
    category: 'Marble',
    color: 'White & Graphite',
    origin: 'Mount Pentelicus, Greece / Carrara Italy',
    finishes: ['Polished', 'Honed'],
    dimensions: '3200 x 1900 x 20 mm',
    thickness: '20 mm',
    priceTier: '$$$$$',
    inStockSlabs: 28,
    bundleNumber: 'IT-STAT-781',
    rarity: 'Exclusive Quarry',
    description: 'Pure snow-white field with dramatic obsidian-grey lattice veining of breathtaking architectural scale.',
    longDescription: 'Chosen for Michelangelo’s legendary sculptures, Statuario Classico exhibits a stark white backdrop accented by deep charcoal rivers.',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=90',
    bookmatchImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=90',
    applications: ['Foyer Flooring', 'Bookmatched Cladding', 'Executive Desk'],
    featured: true,
    specifications: {
      compressiveStrength: '135 MPa',
      waterAbsorption: '0.09%',
      density: '2.73 g/cm³',
      flexuralStrength: '15.8 MPa'
    }
  },
  {
    id: 'nero-marquina-select',
    name: 'Nero Marquina Velvet Black',
    category: 'Marble',
    color: 'Obsidian Black',
    origin: 'Markina-Xemein, Spain',
    finishes: ['Polished', 'Honed', 'Leathered'],
    dimensions: '3100 x 1850 x 20 mm',
    thickness: '20 mm',
    priceTier: '$$$$',
    inStockSlabs: 35,
    bundleNumber: 'ES-NER-442',
    rarity: 'Signature',
    description: 'Deep velvet jet-black marble laced with lightning-bolt calcic white veins.',
    longDescription: 'Quarried in Northern Spain, Nero Marquina Velvet Black introduces sultry contrast and opulent drama.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=90',
    applications: ['Cocktail Bar Countertop', 'Powder Room Bath', 'Feature Wall'],
    featured: true,
    specifications: {
      compressiveStrength: '142 MPa',
      waterAbsorption: '0.15%',
      density: '2.69 g/cm³',
      flexuralStrength: '16.1 MPa'
    }
  },
  {
    id: 'black-cosmic-granite',
    name: 'Black Cosmic Titanium Granite',
    category: 'Granite',
    color: 'Black & Copper Gold',
    origin: 'Victoria, Brazil',
    finishes: ['Polished', 'Leathered'],
    dimensions: '3300 x 1950 x 30 mm',
    thickness: '30 mm',
    priceTier: '$$$$',
    inStockSlabs: 38,
    bundleNumber: 'BR-COS-603',
    rarity: 'Signature',
    description: 'Cosmic swirl of rich copper, gold shimmer, and white quartz crystals on a midnight-black granite foundation.',
    longDescription: 'Black Cosmic Granite captures the mystery of galactic nebulae. Extremely heat resistant and virtually indestructible.',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=90',
    applications: ['Outdoor Kitchen', 'Chef Countertop', 'Fireplace Hearth'],
    featured: true,
    specifications: {
      compressiveStrength: '235 MPa',
      waterAbsorption: '0.02%',
      density: '2.95 g/cm³',
      flexuralStrength: '24.1 MPa'
    }
  },
  {
    id: 'nordic-freestanding-sanitary-tub',
    name: 'Nordic Freestanding Stone Composite Tub',
    category: 'Sanitary Items',
    color: 'Matte White',
    origin: 'Flensburg, Germany / Milan Italy',
    finishes: ['Matte Satin', 'Polished White'],
    dimensions: '1800 x 850 x 560 mm',
    thickness: '25 mm',
    priceTier: '$$$$$',
    inStockSlabs: 18,
    bundleNumber: 'SAN-TUB-101',
    rarity: 'Exclusive Quarry',
    description: 'Monolithic matte white stone composite bathtub engineered for spa-grade thermal insulation.',
    longDescription: 'Cast from natural calcite stone powders bonded with high-grade resin. Features integrated overflow protection and velvety touch texture.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1400&q=90',
    applications: ['Master Spa Bath', 'Penthouse Suite', 'Outdoor Bath Sanctuary'],
    featured: true,
    specifications: {
      compressiveStrength: '310 MPa',
      waterAbsorption: '< 0.01%',
      density: '2.35 g/cm³',
      flexuralStrength: '48.0 MPa'
    }
  }
];

export const SHOWROOM_LOCATIONS: Showroom[] = [
  {
    id: 'new-york',
    city: 'New York',
    title: '5th Avenue Design District Flagship',
    address: '680 Fifth Avenue, Suite 1400, New York, NY 10019',
    phone: '+1 (212) 890-4500',
    email: 'ny.showroom@aureliamarmi.com',
    hours: 'Mon - Fri: 9:00 AM - 6:00 PM | Sat: By Private Appointment',
    mapEmbedUrl: 'https://maps.google.com/maps?q=680%20Fifth%20Avenue%20New%20York&t=&z=14&ie=UTF8&iwloc=&output=embed',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
    coordinates: { lat: 40.7608, lng: -73.9754 },
    virtualTourAvailable: true
  },
  {
    id: 'milan',
    city: 'Milan',
    title: 'Via Montenapoleone Gallery & Studio',
    address: 'Via Montenapoleone 18, 20121 Milano MI, Italy',
    phone: '+39 02 7600 3411',
    email: 'milan.atelier@aureliamarmi.com',
    hours: 'Mon - Sat: 10:00 AM - 7:00 PM',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Via%20Montenapoleone%2018%20Milan&t=&z=14&ie=UTF8&iwloc=&output=embed',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85',
    coordinates: { lat: 45.4682, lng: 9.1953 },
    virtualTourAvailable: true
  },
  {
    id: 'london',
    city: 'London',
    title: 'Mayfair Experience Center',
    address: '42 Berkeley Square, Mayfair, London W1J 5AW, UK',
    phone: '+44 20 7499 8200',
    email: 'london.gallery@aureliamarmi.com',
    hours: 'Mon - Fri: 9:30 AM - 6:30 PM | Sat: Appointment Only',
    mapEmbedUrl: 'https://maps.google.com/maps?q=42%20Berkeley%20Square%20London&t=&z=14&ie=UTF8&iwloc=&output=embed',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=85',
    coordinates: { lat: 51.5098, lng: -0.1456 },
    virtualTourAvailable: true
  },
  {
    id: 'dubai',
    city: 'Dubai',
    title: 'DIFC Luxury Atelier',
    address: 'Gate Precinct 4, Level 5, DIFC, Dubai, UAE',
    phone: '+971 4 362 7000',
    email: 'dubai.atelier@aureliamarmi.com',
    hours: 'Sun - Thu: 9:00 AM - 8:00 PM',
    mapEmbedUrl: 'https://maps.google.com/maps?q=DIFC%20Dubai&t=&z=14&ie=UTF8&iwloc=&output=embed',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85',
    coordinates: { lat: 25.2048, lng: 55.2708 },
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
    icon: 'Sparkles'
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
    title: '2026 Luxury Marble Trends: Book-Matched Veining & Bold Calacatta Gold',
    slug: '2026-luxury-marble-trends',
    category: 'Design Trends',
    readTime: '6 min read',
    date: 'July 18, 2026',
    author: 'Victoria Sterling',
    authorRole: 'Chief Design Curator',
    summary: 'Discover how top interior architects are deploying dramatic book-matched marble slabs to turn living rooms and master suites into monolithic stone sanctuaries.',
    content: `Natural stone has evolved from a utilitarian countertop material into the centerpiece of luxury interior design. As we progress through 2026, the preference has shifted dramatically toward bold, sculptural stone selections with high-contrast veining.

### 1. The Renaissance of Book-Matching
Book-matching involves pairing adjacent slabs cut from the exact same marble block so that their veining mirrors each other like an open book. This technique creates mesmerizing butterfly patterns across kitchen waterfalls and feature walls.

### 2. Warm Gold Veining Over Monochromatic Grey
While cool grey Statuario dominated the previous decade, warm honey and champagne tones—exemplified by Calacatta Gold Oro Extra—are now taking center stage in high-end residential estates.

### 3. Sintered Ultra-Thin Porcelain Facades
Architects are increasingly incorporating lightweight porcelain sintered slabs into outdoor living spaces and high-rise apartment exterior facades for zero-fading weather endurance.`,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    tags: ['Marble', 'Calacatta', 'Bookmatching', 'Interior Design']
  },
  {
    id: 'quartzite-vs-marble-guide',
    title: 'Quartzite vs. Marble: Choosing the Right Exotic Stone for Your Kitchen',
    slug: 'quartzite-vs-marble-kitchen-guide',
    category: 'Material Guide',
    readTime: '8 min read',
    date: 'June 24, 2026',
    author: 'Dr. Alessandro Conti',
    authorRole: 'Senior Petrographer & Quarry Director',
    summary: 'Understanding the geological differences between metamorphic marble and quartzite to choose stone that balances delicate beauty with heavy culinary utility.',
    content: `Choosing between natural marble and quartzite for a high-traffic kitchen island is one of the most critical decisions in high-end residential architectural projects.

### The Geology of Quartzite
Unlike marble, which is composed primarily of calcium carbonate, quartzite originates as pure quartz sandstone that undergoes intense tectonic heat and pressure. The result is a stone rated 7 on the Mohs hardness scale—harder than steel knife blades.

### Acid Resistance & Etching
Marble reacts with lemons, wine, and acidic vinegar, requiring periodic sealant maintenance. Quartzite, by contrast, is completely chemically inert to culinary acids, preserving its factory polish effortlessly.`,
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
    tags: ['Quartzite', 'Kitchen Countertops', 'Material Science', 'Maintenance']
  },
  {
    id: 'stone-maintenance-masterclass',
    title: 'The Ultimate Stone Maintenance Masterclass: Preserving Luster & Vein Depth',
    slug: 'stone-maintenance-masterclass',
    category: 'Maintenance',
    readTime: '5 min read',
    date: 'May 12, 2026',
    author: 'Matteo Rossi',
    authorRole: 'Master Stone Mason',
    summary: 'Expert techniques used by museum stone conservators to clean, seal, and polish luxury natural marble and exotic granite surfaces.',
    content: `Proper care ensures natural marble and granite age gracefully over centuries. Here is our master stone care protocol.

1. **pH-Neutral Cleaners Only**: Never use ammonia, bleach, or vinegar on natural calcite marble. Always use specialized pH-neutral stone soaps.
2. **Penetrating Hydrophobic Sealers**: Apply fluoropolymer sealers once every 12 to 18 months to create a microscopic barrier against oil and water stains.
3. **Prompt Spill Cleanup**: Wipe up wine, coffee, or citrus drips immediately using soft microfiber cloths.`,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
    tags: ['Stone Care', 'Sealing', 'Marble Maintenance']
  }
];
