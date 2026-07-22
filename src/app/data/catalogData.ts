export interface CatalogProduct {
  id: number | string;
  slug: string;
  name: string;
  category: 'Floor Tiles' | 'Wall Tiles' | 'Granite' | 'Marble' | 'Sanitary Items' | string;
  color: 'Black' | 'White' | 'Brown' | 'Red' | 'Pink' | 'Green' | 'Grey' | 'Blue' | string;
  price: number;
  unit: string; // "Per Square Foot"
  image: string;
  featured?: boolean;
  colorHex?: string;
  finishes?: string[];
  description?: string;
  origin?: string;
  popularityScore?: number;
  createdDate?: string;
  specifications?: {
    compressiveStrength: string;
    waterAbsorption: string;
    density: string;
    flexuralStrength: string;
  };
}

export const COLOR_HEX_MAP: Record<string, string> = {
  Black: '#1A1A1A',
  White: '#F3F4F6',
  Brown: '#78350F',
  Red: '#EF233C',
  Pink: '#F472B6',
  Green: '#059669',
  Grey: '#6B7280',
  Blue: '#2563EB'
};

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: 1,
    slug: "adunik-brown-grey-granite",
    name: "Adunik Brown/Grey Granite",
    category: "Granite",
    color: "Brown",
    colorHex: "#78350F",
    price: 130,
    unit: "Per Square Foot",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
    featured: true,
    popularityScore: 98,
    createdDate: "2026-01-15",
    origin: "Rajasthan, India",
    finishes: ["Polished", "Honed", "Leathered"],
    description: "Deep chocolate brown field punctuated by reflective quartz crystals and subtle grey ribbons.",
    specifications: {
      compressiveStrength: "215 MPa",
      waterAbsorption: "< 0.08%",
      density: "2.65 g/cm³",
      flexuralStrength: "38 MPa"
    }
  },
  {
    id: 2,
    slug: "black-galaxy-granite",
    name: "Black Galaxy Granite",
    category: "Granite",
    color: "Black",
    colorHex: "#1A1A1A",
    price: 75,
    unit: "Per Square Foot",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
    featured: true,
    popularityScore: 100,
    createdDate: "2026-02-01",
    origin: "Andhra Pradesh, India",
    finishes: ["Polished", "Fluted"],
    description: "Pitch black background flecked with golden bronze metallic flakes that shimmer under direct light.",
    specifications: {
      compressiveStrength: "240 MPa",
      waterAbsorption: "< 0.04%",
      density: "2.75 g/cm³",
      flexuralStrength: "42 MPa"
    }
  },
  {
    id: 3,
    slug: "statuario-white-marble",
    name: "Statuario Extra White Marble",
    category: "Marble",
    color: "White",
    colorHex: "#F3F4F6",
    price: 280,
    unit: "Per Square Foot",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    featured: true,
    popularityScore: 95,
    createdDate: "2026-03-10",
    origin: "Carrara, Italy",
    finishes: ["Polished", "Honed"],
    description: "Pure alabaster white marble featuring bold grey charcoal veining quarried in Tuscany.",
    specifications: {
      compressiveStrength: "190 MPa",
      waterAbsorption: "< 0.12%",
      density: "2.70 g/cm³",
      flexuralStrength: "35 MPa"
    }
  },
  {
    id: 4,
    slug: "royal-calacatta-oro-floor-tile",
    name: "Royal Calacatta Oro Vitrified Floor Tile",
    category: "Floor Tiles",
    color: "White",
    colorHex: "#F3F4F6",
    price: 95,
    unit: "Per Square Foot",
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=85",
    featured: false,
    popularityScore: 90,
    createdDate: "2026-01-20",
    origin: "Castellón, Spain",
    finishes: ["Polished", "Matt"],
    description: "High-definition vitrified floor tile replicating Italian Calacatta gold veins with zero porosity.",
    specifications: {
      compressiveStrength: "220 MPa",
      waterAbsorption: "< 0.02%",
      density: "2.45 g/cm³",
      flexuralStrength: "45 MPa"
    }
  },
  {
    id: 5,
    slug: "imperial-red-granite",
    name: "Imperial Red Granite",
    category: "Granite",
    color: "Red",
    colorHex: "#EF233C",
    price: 110,
    unit: "Per Square Foot",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
    featured: true,
    popularityScore: 88,
    createdDate: "2026-02-15",
    origin: "Jhansi, India",
    finishes: ["Polished", "Bush Hammered"],
    description: "Vibrant ruby-red granite featuring deep crimson hues and micro black quartz clusters.",
    specifications: {
      compressiveStrength: "230 MPa",
      waterAbsorption: "< 0.05%",
      density: "2.68 g/cm³",
      flexuralStrength: "40 MPa"
    }
  },
  {
    id: 6,
    slug: "moroccan-azure-wall-tile",
    name: "Moroccan Azure Glazed Wall Tile",
    category: "Wall Tiles",
    color: "Blue",
    colorHex: "#2563EB",
    price: 85,
    unit: "Per Square Foot",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=85",
    featured: false,
    popularityScore: 92,
    createdDate: "2026-03-01",
    origin: "Fes, Morocco",
    finishes: ["Glossy", "Polished"],
    description: "Hand-glazed artisan wall tile featuring deep cobalt blue color depth and glossy light reflection.",
    specifications: {
      compressiveStrength: "175 MPa",
      waterAbsorption: "< 0.40%",
      density: "2.30 g/cm³",
      flexuralStrength: "32 MPa"
    }
  },
  {
    id: 7,
    slug: "nordic-freestanding-bathtub",
    name: "Nordic Freestanding Stone Composite Tub",
    category: "Sanitary Items",
    color: "White",
    colorHex: "#F3F4F6",
    price: 340,
    unit: "Per Piece",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85",
    featured: true,
    popularityScore: 96,
    createdDate: "2026-04-01",
    origin: "Germany",
    finishes: ["Matte Satin", "Polished"],
    description: "Monolithic matte white stone composite bathtub engineered for thermal insulation.",
    specifications: {
      compressiveStrength: "260 MPa",
      waterAbsorption: "< 0.01%",
      density: "2.35 g/cm³",
      flexuralStrength: "48 MPa"
    }
  },
  {
    id: 8,
    slug: "rosy-pink-marble",
    name: "Rosy Pink Norwegian Marble",
    category: "Marble",
    color: "Pink",
    colorHex: "#F472B6",
    price: 195,
    unit: "Per Square Foot",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85",
    featured: false,
    popularityScore: 84,
    createdDate: "2026-02-20",
    origin: "Fauske, Norway",
    finishes: ["Honed", "Polished"],
    description: "Delicate blush pink marble with soft ivory striations and translucent calcite minerality.",
    specifications: {
      compressiveStrength: "185 MPa",
      waterAbsorption: "< 0.15%",
      density: "2.62 g/cm³",
      flexuralStrength: "34 MPa"
    }
  },
  {
    id: 9,
    slug: "tan-brown-granite",
    name: "Tan Brown Premium Granite",
    category: "Granite",
    color: "Brown",
    colorHex: "#78350F",
    price: 90,
    unit: "Per Square Foot",
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85",
    featured: false,
    popularityScore: 91,
    createdDate: "2026-01-10",
    origin: "Telangana, India",
    finishes: ["Polished", "Leathered"],
    description: "Rich dark brown granite embedded with copper, garnet red, and chocolate mineral crystals.",
    specifications: {
      compressiveStrength: "225 MPa",
      waterAbsorption: "< 0.06%",
      density: "2.66 g/cm³",
      flexuralStrength: "39 MPa"
    }
  },
  {
    id: 10,
    slug: "steel-grey-granite",
    name: "Steel Grey Lappato Granite",
    category: "Granite",
    color: "Grey",
    colorHex: "#6B7280",
    price: 85,
    unit: "Per Square Foot",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
    featured: false,
    popularityScore: 89,
    createdDate: "2026-03-05",
    origin: "Ongole, India",
    finishes: ["Lappato", "Honed", "Polished"],
    description: "Contemporary silver-grey granite featuring uniform graphite specks and low-sheen satin finish.",
    specifications: {
      compressiveStrength: "235 MPa",
      waterAbsorption: "< 0.05%",
      density: "2.69 g/cm³",
      flexuralStrength: "41 MPa"
    }
  },
  {
    id: 11,
    slug: "alaska-white-granite",
    name: "Alaska White Exotic Granite",
    category: "Granite",
    color: "White",
    colorHex: "#F3F4F6",
    price: 160,
    unit: "Per Square Foot",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    featured: true,
    popularityScore: 97,
    createdDate: "2026-03-15",
    origin: "Minas Gerais, Brazil",
    finishes: ["Polished", "Leathered"],
    description: "Frost white field blended with warm taupe, silver mica, and dramatic onyx veining accents.",
    specifications: {
      compressiveStrength: "210 MPa",
      waterAbsorption: "< 0.08%",
      density: "2.64 g/cm³",
      flexuralStrength: "37 MPa"
    }
  },
  {
    id: 12,
    slug: "absolute-black-granite",
    name: "Absolute Black Jet Granite",
    category: "Granite",
    color: "Black",
    colorHex: "#1A1A1A",
    price: 120,
    unit: "Per Square Foot",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
    featured: false,
    popularityScore: 94,
    createdDate: "2026-02-10",
    origin: "Khammam, India",
    finishes: ["Polished", "Honed", "Flamed"],
    description: "Solid jet-black granite with ultra-fine grain density and high mirror reflectivity.",
    specifications: {
      compressiveStrength: "250 MPa",
      waterAbsorption: "< 0.03%",
      density: "2.80 g/cm³",
      flexuralStrength: "45 MPa"
    }
  }
];
