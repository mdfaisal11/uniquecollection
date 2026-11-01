// =====================================================================
// UniqueCollection - Product Catalog & Seed Data
// Currency: Rs. (NPR) | WhatsApp: +977 9708425276 | Email: mdfaisal2202@gmail.com
// =====================================================================

var WHATSAPP_PHONE = "9779708425276"; // WhatsApp: +977 9708425276
var STORE_EMAIL = "mdfaisal2202@gmail.com"; // Email: mdfaisal2202@gmail.com
var CURRENCY_SYMBOL = "Rs. ";

// Initial Product Catalog
var DEFAULT_PRODUCTS = [
  // WATCHES
  {
    id: "prod-watch-1",
    title: "Monaco Chronograph Royal Black Watch",
    category: "watches",
    price: 3499,
    originalPrice: 5999,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80",
    badge: "Bestseller",
    rating: 4.9,
    reviewsCount: 142,
    inStock: true,
    description: "Handcrafted luxury chronograph featuring high-precision quartz movement, scratch-resistant sapphire crystal, and genuine top-grain calfskin leather strap.",
    features: [
      "Precision Japanese Quartz Movement",
      "Sapphire Crystal Scratch-Resistant Glass",
      "Water Resistant up to 50 Meters (5 ATM)",
      "Genuine Breathable Leather Strap",
      "Luminous Hands for Night Visibility",
      "Includes Luxury Wooden Presentation Box"
    ],
    options: ["Classic Black", "Royal Silver", "Rose Gold"]
  },
  {
    id: "prod-watch-2",
    title: "Audemars Imperial Gold Dial Automatic Watch",
    category: "watches",
    price: 4999,
    originalPrice: 7999,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    badge: "Luxury Edition",
    rating: 5.0,
    reviewsCount: 98,
    inStock: true,
    description: "An epitome of elegance. Designed for the modern trendsetter with a skeleton automatic mechanism and radiant 18K gold electroplated casing.",
    features: [
      "Self-Winding Automatic Mechanical Movement",
      "18K Gold PVD Durable Finish",
      "Double-Lock Stainless Steel Clasp",
      "Exhibition Case Back to View Gears",
      "2-Year Manufacturer Warranty"
    ],
    options: ["Solid Gold", "Two-Tone Gold & Steel"]
  },
  {
    id: "prod-watch-3",
    title: "Apex Chrono Sport Steel Edition",
    category: "watches",
    price: 2799,
    originalPrice: 4599,
    image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=80",
    badge: "Hot Deal",
    rating: 4.8,
    reviewsCount: 86,
    inStock: true,
    description: "Rugged yet sophisticated sports chronograph engineered with solid 316L stainless steel and tachymeter bezel for peak performance.",
    features: [
      "316L Surgical Grade Stainless Steel",
      "Triple Sub-Dial Stopwatch Chrono",
      "Water Resistant 100M (Swimming safe)",
      "Anti-Reflective Mineral Crystal",
      "Date Display Window at 4 O'Clock"
    ],
    options: ["Steel Silver", "Matte Carbon Black"]
  },

  // SUNGLASSES
  {
    id: "prod-sunglass-1",
    title: "Viper Polarized Aviator Gold Sunglasses",
    category: "sunglasses",
    price: 1599,
    originalPrice: 2899,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    badge: "Trending",
    rating: 4.9,
    reviewsCount: 164,
    inStock: true,
    description: "Timeless aviator styling enhanced with 9-layer TAC polarized lenses that eliminate 99.9% of harmful glare and provide 100% UV400 sun protection.",
    features: [
      "UV400 Category 3 Sun Protection",
      "9-Layer HD Polarized Anti-Glare Lens",
      "Ultra-Lightweight Alloy Metal Frame",
      "Soft Silicone Adjustable Nose Pads",
      "Comes with Hard Leather Case & Microfiber Cloth"
    ],
    options: ["Gold / Gradient Brown", "Gunmetal / Dark Smoke", "Black / Mirror Blue"]
  },
  {
    id: "prod-sunglass-2",
    title: "Retro Wayfarer Matte Obsidian Shades",
    category: "sunglasses",
    price: 1299,
    originalPrice: 2299,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
    badge: "Hot Deal",
    rating: 4.7,
    reviewsCount: 112,
    inStock: true,
    description: "The quintessential retro frame crafted from premium Italian acetate for superior durability and all-day comfortable wear.",
    features: [
      "Premium Handcrafted Italian Acetate",
      "Full UV400 UVA & UVB Protection",
      "Reinforced 5-Barrel Metal Hinges",
      "Ergonomic Non-Slip Comfort Temple Design",
      "Scratch & Impact Resistant Lenses"
    ],
    options: ["Matte Black", "Classic Tortoise Shell"]
  },
  {
    id: "prod-sunglass-3",
    title: "Hexagonal Edge Rimless Sunnies",
    category: "sunglasses",
    price: 1899,
    originalPrice: 3299,
    image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80",
    badge: "New Arrival",
    rating: 4.8,
    reviewsCount: 75,
    inStock: true,
    description: "Geometric rimless sunglasses with beveled diamond-cut lens edges and champagne gold titanium temple arms for high fashion style.",
    features: [
      "Diamond Beveled Rimless Lens Cut",
      "Titanium Featherweight Temples",
      "100% UV Protection Against Blue Light & Glare",
      "Hypoallergenic Titanium Nose Bridge",
      "Includes Premium Magnetic Case"
    ],
    options: ["Champagne Gold", "Smoky Silver"]
  },

  // CLOTHES
  {
    id: "prod-cloth-1",
    title: "Signature Premium Oxford Linen Shirt",
    category: "clothes",
    price: 1899,
    originalPrice: 3499,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    badge: "Bestseller",
    rating: 4.9,
    reviewsCount: 230,
    inStock: true,
    description: "Tailored to perfection from 100% pure European flax linen. Delivers supreme breathability, relaxed luxury elegance, and all-day comfort.",
    features: [
      "100% Pure European Flax Breathable Linen",
      "Modern Tailored Slim-Regular Fit",
      "Pre-Washed & Pre-Shrunk for Zero Shrinkage",
      "Real Pearlized Buttons & Stiffened Collar",
      "Easy Iron & Machine Washable"
    ],
    options: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "prod-cloth-2",
    title: "Italian Wool Slim Fit Velvet Blazer",
    category: "clothes",
    price: 5999,
    originalPrice: 9999,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    badge: "Exclusive",
    rating: 5.0,
    reviewsCount: 64,
    inStock: true,
    description: "Exquisite structured blazer woven with rich wool blend velvet. Featuring peak lapels, interior silk lining, and functional ticket pockets.",
    features: [
      "Luxury Wool & Micro-Velvet Blend",
      "Double-Vented Back for Unrestricted Movement",
      "Rich Jacquard Silk Interior Lining",
      "Internal Passport & Mobile Pockets",
      "Dry Clean Only / Tailored Silhouette"
    ],
    options: ["38 (S)", "40 (M)", "42 (L)", "44 (XL)"]
  },
  {
    id: "prod-cloth-3",
    title: "Urban Minimalist Oversized Heavyweight Tee",
    category: "clothes",
    price: 999,
    originalPrice: 1799,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    badge: "Trending",
    rating: 4.8,
    reviewsCount: 189,
    inStock: true,
    description: "Crafted from 240 GSM combed cotton. Boxy drop-shoulder aesthetic designed for contemporary streetwear enthusiasts.",
    features: [
      "240 GSM Heavyweight 100% Combed Cotton",
      "Boxy Oversized Fit with Drop Shoulder",
      "Thick Ribbed Crew Neck Collar",
      "Fade-Resistant Eco-Friendly Bio-Washed Dye",
      "Double Needle Stitched Hem & Cuffs"
    ],
    options: ["S", "M", "L", "XL"]
  },
  {
    id: "prod-cloth-4",
    title: "Heritage Bomber Jacket with Fleece Collar",
    category: "clothes",
    price: 3999,
    originalPrice: 6999,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    badge: "Hot Deal",
    rating: 4.8,
    reviewsCount: 115,
    inStock: true,
    description: "Insulated aviation-inspired bomber jacket with windproof outer shell, soft sherpa fleece collar, and heavy-duty brass YKK zipper.",
    features: [
      "Windproof & Water-Repellent High-Density Shell",
      "Detachable Warm Sherpa Fleece Collar",
      "Authentic Heavy Duty YKK Metal Zippers",
      "Dual Exterior Hand Warmer Pockets + Arm Utility Pocket",
      "Ribbed Storm Cuffs and Waistband"
    ],
    options: ["M", "L", "XL", "XXL"]
  },

  // FOOTWEAR
  {
    id: "prod-footwear-1",
    title: "Monarch Hand-Stitched Leather Derby Shoes",
    category: "footwear",
    price: 3799,
    originalPrice: 6499,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    badge: "Bestseller",
    rating: 4.9,
    reviewsCount: 138,
    inStock: true,
    description: "Handcrafted from full-grain Argentine leather, Goodyear welted with memory foam insole for effortless all-day corporate or wedding elegance.",
    features: [
      "100% Genuine Full-Grain Leather Upper",
      "Goodyear Welted Construction (Can be resoled)",
      "High-Density Orthopedic Memory Foam Insole",
      "Non-Slip Ribbed Rubber Sole Heel",
      "Breathable Leather Inner Lining"
    ],
    options: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]
  },
  {
    id: "prod-footwear-2",
    title: "CloudFlow White Leather Streetwear Sneakers",
    category: "footwear",
    price: 2499,
    originalPrice: 4299,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    badge: "Trending",
    rating: 4.8,
    reviewsCount: 204,
    inStock: true,
    description: "Crisp white minimalist sneakers designed with ultra-cushioned EVA bounce midsole and supple calfskin leather for versatile styling.",
    features: [
      "Supple Calfskin Leather Exterior",
      "Cloud Cushion High-Rebound EVA Sole",
      "Padded Ankle Collar & Tongue",
      "Stain-Resistant Protective Nano Coating",
      "Durable Waxed Cotton Laces"
    ],
    options: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]
  },

  // ACCESSORIES / PERFUMES
  {
    id: "prod-acc-1",
    title: "Noir Oud Absolute Eau De Parfum (100ml)",
    category: "perfumes",
    price: 2499,
    originalPrice: 4199,
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
    badge: "Exclusive",
    rating: 4.9,
    reviewsCount: 177,
    inStock: true,
    description: "Rich, seductive fragrance combining aged Cambodian oud, smoked amber, bergamot, and bourbon vanilla. Lasts 14+ hours on skin and fabric.",
    features: [
      "Concentrated Eau De Parfum (25% Fragrance Oils)",
      "Top Notes: Bergamot, Pink Peppercorn",
      "Heart Notes: Smoked Oud, Turkish Rose, Cardamom",
      "Base Notes: Ambergris, Madagascar Vanilla, Sandalwood",
      "Up to 16 Hours Long-Lasting Sillage"
    ],
    options: ["50ml", "100ml Bottle"]
  },
  {
    id: "prod-acc-2",
    title: "Bifold Top-Grain RFID Leather Wallet",
    category: "accessories",
    price: 999,
    originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    badge: "Hot Deal",
    rating: 4.8,
    reviewsCount: 94,
    inStock: true,
    description: "Slimline pocket wallet engineered with certified RFID blocking mesh to protect your contactless cards from digital theft.",
    features: [
      "100% Genuine Full-Grain Crazy Horse Leather",
      "Military-Grade RFID Shielding Technology",
      "Holds up to 10 Cards + Cash Clip Pocket",
      "Quick-Access Thumb Slot for Daily Card",
      "Ultra-Slim 0.4 Inch Profile"
    ],
    options: ["Vintage Tan Brown", "Obsidian Black"]
  }
];

// Seed Users (Clients & Admin)
var DEFAULT_USERS = [
  {
    id: "user-admin",
    name: "Md Faisal (Admin)",
    email: "mdfaisal2202@gmail.com",
    phone: "+977 9708425276",
    role: "admin",
    password: "admin123", // Admin Password: admin123
    createdAt: "2026-01-10T10:00:00Z"
  },
  {
    id: "user-client-1",
    name: "Sunil Shrestha",
    email: "sunil@gmail.com",
    phone: "+977 9801234567",
    role: "client",
    password: "client123",
    createdAt: "2026-02-15T14:30:00Z"
  },
  {
    id: "user-client-2",
    name: "Anjali Thapa",
    email: "anjali@gmail.com",
    phone: "+977 9841987654",
    role: "client",
    password: "client123",
    createdAt: "2026-03-01T09:15:00Z"
  }
];

// Seed Orders
var DEFAULT_ORDERS = [
  {
    orderId: "UC-849201",
    createdAt: "2026-10-28T11:20:00Z",
    customer: {
      name: "Sunil Shrestha",
      phone: "+977 9801234567",
      email: "sunil@gmail.com",
      address: "New Baneshwor, Kathmandu, Nepal",
      pincode: "44600"
    },
    items: [
      {
        id: "prod-watch-1",
        title: "Monaco Chronograph Royal Black Watch",
        price: 3499,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80"
      }
    ],
    totalAmount: 3499,
    paymentMethod: "Cash on Delivery",
    status: "Shipped",
    trackingNotes: "Dispatched via Express Courier. Expected delivery in 24 hours."
  },
  {
    orderId: "UC-512934",
    createdAt: "2026-10-30T16:45:00Z",
    customer: {
      name: "Anjali Thapa",
      phone: "+977 9841987654",
      email: "anjali@gmail.com",
      address: "Lalitpur Jhamsikhel, Ward 3, Nepal",
      pincode: "44700"
    },
    items: [
      {
        id: "prod-sunglass-1",
        title: "Viper Polarized Aviator Gold Sunglasses",
        price: 1599,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "prod-cloth-1",
        title: "Signature Premium Oxford Linen Shirt",
        price: 1899,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
      }
    ],
    totalAmount: 3498,
    paymentMethod: "UPI / Online QR",
    status: "Confirmed",
    trackingNotes: "Payment verified. Packaging underway."
  }
];

// Seed Reviews
var DEFAULT_REVIEWS = {
  "prod-watch-1": [
    {
      id: "rev-1",
      userName: "Bikram Karki",
      rating: 5,
      date: "2026-10-25",
      verified: true,
      comment: "Unbelievable quality! The sapphire crystal is scratch-proof and the calfskin leather strap smells genuine. Ordered directly via WhatsApp (+977 9708425276) and received it the next day."
    },
    {
      id: "rev-2",
      userName: "Nirajan Adhikari",
      rating: 5,
      date: "2026-10-20",
      verified: true,
      comment: "Looks like a 50,000 rupee luxury watch on my wrist. The weight and chronograph sub-dials are 100% functional."
    }
  ],
  "prod-sunglass-1": [
    {
      id: "rev-3",
      userName: "Pratima Gurung",
      rating: 5,
      date: "2026-10-18",
      verified: true,
      comment: "The polarized lenses are exceptional for sunny driving in Kathmandu! Glare is completely gone. Very lightweight frame."
    }
  ],
  "prod-cloth-1": [
    {
      id: "rev-4",
      userName: "Sujan Maharjan",
      rating: 5,
      date: "2026-10-22",
      verified: true,
      comment: "Pure European linen. Breathable, does not wrinkle easily and the slim fit cut is tailored properly."
    }
  ]
};

// FAQ Data
var FAQ_DATA = [
  {
    q: "How do I place an order directly on WhatsApp (+977 9708425276)?",
    a: "On any product card, quick view modal, or in your shopping cart, click the 'Order on WhatsApp' button. Your selected items, size, price, and quantities will automatically format into a message sent directly to +977 9708425276. We confirm orders instantly!"
  },
  {
    q: "Can I register as a customer and track my orders?",
    a: "Yes! Click the 'Customer Sign In / Register' button to create your free account. Once registered, all your orders are saved to your profile with live tracking badges. You can also order as a guest."
  },
  {
    q: "How do I login as an Admin and manage the store?",
    a: "Click 'Admin Login' at the top right. Enter username 'admin' and password 'admin123'. You will gain full access to view customer orders, customer phone numbers, addresses, update order statuses, add products, and drag-and-drop merchandise photos!"
  },
  {
    q: "Is Cash on Delivery (COD) available?",
    a: "Yes, Cash on Delivery is available across major cities and regions! Standard delivery takes 1 to 3 business days. You can also pay via digital wallet/UPI or verify directly with our team on WhatsApp (+977 9708425276)."
  },
  {
    q: "What is UniqueCollection's 7-Day Return Policy?",
    a: "We guarantee a 100% 7-day hassle-free replacement or return. If an item doesn't fit or meet your expectations, contact Md Faisal directly at mdfaisal2202@gmail.com or WhatsApp +977 9708425276."
  }
];

// Testimonials
var TESTIMONIALS = [
  {
    name: "Sunil Shrestha",
    city: "Kathmandu",
    rating: 5,
    comment: "Ordered the Monaco Chronograph watch and Aviator shades. Quality is exceptional! WhatsApp ordering to +977 9708425276 took 30 seconds and arrived promptly. Super satisfied!",
    product: "Monaco Chronograph Royal Black Watch"
  },
  {
    name: "Anjali Thapa",
    city: "Lalitpur",
    rating: 5,
    comment: "The linen shirt fabric is pure European quality. Very breathable and fitting is spot on. UniqueCollection customer service on WhatsApp answered all my sizing queries immediately.",
    product: "Signature Premium Oxford Linen Shirt"
  },
  {
    name: "Rohan Shrestha",
    city: "Pokhara",
    rating: 5,
    comment: "Got the Noir Oud Perfume and Derby Shoes. Everyone complimented the fragrance! 100% authentic products. UniqueCollection is now my go-to luxury destination.",
    product: "Noir Oud Absolute Eau De Parfum"
  }
];

// Attach explicitly to window for cross-script access
if (typeof window !== "undefined") {
  window.WHATSAPP_PHONE = WHATSAPP_PHONE;
  window.STORE_EMAIL = STORE_EMAIL;
  window.CURRENCY_SYMBOL = CURRENCY_SYMBOL;
  window.DEFAULT_PRODUCTS = DEFAULT_PRODUCTS;
  window.DEFAULT_USERS = DEFAULT_USERS;
  window.DEFAULT_ORDERS = DEFAULT_ORDERS;
  window.DEFAULT_REVIEWS = DEFAULT_REVIEWS;
  window.FAQ_DATA = FAQ_DATA;
  window.TESTIMONIALS = TESTIMONIALS;
}
