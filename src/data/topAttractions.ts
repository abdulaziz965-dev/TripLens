export interface Attraction {
  id: string;
  name: string;
  rating: number;
  price: string;
  duration: string;
  description: string;
  image?: string;
}

export const topAttractions: Record<string, Attraction[]> = {
  hyderabad: [
    {
      id: "charminar",
      name: "Charminar",
      image: "https://images.unsplash.com/photo-1588416499018-dc5f4f2b8e84?w=1200",
      rating: 4.8,
      price: "₹100",
      duration: "2 Hours",
      description: "The iconic monument and symbol of Hyderabad."
    },
    {
      id: "golconda",
      name: "Golconda Fort",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200",
      rating: 4.7,
      price: "₹150",
      duration: "3 Hours",
      description: "Historic fort famous for its architecture and city views."
    },
    {
      id: "ramoji",
      name: "Ramoji Film City",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200",
      rating: 4.8,
      price: "₹1350",
      duration: "Full Day",
      description: "One of the world's largest film studio complexes."
    },
    {
      id: "salarjung",
      name: "Salar Jung Museum",
      image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200",
      rating: 4.6,
      price: "₹50",
      duration: "2-3 Hours",
      description: "Home to one of India's largest art collections."
    },
    {
      id: "hussainsagar",
      name: "Hussain Sagar",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200",
      rating: 4.5,
      price: "₹200",
      duration: "2 Hours",
      description: "Famous lake featuring the giant Buddha statue."
    }
  ],

  ooty: [
    {
      id: "doddabetta",
      name: "Doddabetta Peak",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200",
      rating: 4.8,
      price: "₹150",
      duration: "2 Hours",
      description: "Highest peak in the Nilgiris with panoramic views."
    },
    {
      id: "botanical",
      name: "Government Botanical Garden",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1200",
      rating: 4.7,
      price: "₹100",
      duration: "2 Hours",
      description: "Beautiful botanical garden with rare plants."
    },
    {
      id: "ootylake",
      name: "Ooty Lake",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
      rating: 4.6,
      price: "₹350",
      duration: "1 Hour",
      description: "Popular boating destination surrounded by hills."
    },
    {
      id: "teamuseum",
      name: "Tea Museum",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200",
      rating: 4.5,
      price: "₹200",
      duration: "90 Minutes",
      description: "Learn the history and production of Nilgiri tea."
    },
    {
      id: "toytrain",
      name: "Nilgiri Mountain Railway",
      image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200",
      rating: 4.9,
      price: "₹600",
      duration: "4 Hours",
      description: "UNESCO heritage toy train through scenic mountains."
    }
  ],

  goa: [
    {
      id: "baga",
      name: "Baga Beach",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
      rating: 4.8,
      price: "Free",
      duration: "Half Day",
      description: "Goa's most famous beach for water sports and nightlife."
    },
    {
      id: "calangute",
      name: "Calangute Beach",
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200",
      rating: 4.7,
      price: "Free",
      duration: "Half Day",
      description: "Popular beach known as the Queen of Beaches."
    },
    {
      id: "dudhsagar",
      name: "Dudhsagar Falls",
      image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200",
      rating: 4.9,
      price: "₹600",
      duration: "4 Hours",
      description: "One of India's tallest and most spectacular waterfalls."
    },
    {
      id: "aguada",
      name: "Fort Aguada",
      image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1200",
      rating: 4.7,
      price: "₹100",
      duration: "2 Hours",
      description: "Historic Portuguese fort overlooking the Arabian Sea."
    },
    {
      id: "bomjesus",
      name: "Basilica Of Bom Jesus",
      image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1200",
      rating: 4.8,
      price: "Free",
      duration: "1 Hour",
      description: "UNESCO World Heritage church in Old Goa."
    }
  ],

  mysore: [
    {
      id: "palace",
      name: "Mysore Palace",
      image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200",
      rating: 4.9,
      price: "₹100",
      duration: "3 Hours",
      description: "The most famous royal palace in South India."
    },
    {
      id: "chamundi",
      name: "Chamundi Hills",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
      rating: 4.8,
      price: "Free",
      duration: "2 Hours",
      description: "Scenic hilltop temple with panoramic city views."
    },
    {
      id: "brindavan",
      name: "Brindavan Gardens",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1200",
      rating: 4.7,
      price: "₹75",
      duration: "2 Hours",
      description: "Famous musical fountain and landscaped gardens."
    },
    {
      id: "zoo",
      name: "Mysore Zoo",
      image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=1200",
      rating: 4.7,
      price: "₹120",
      duration: "3 Hours",
      description: "One of India's oldest and best-maintained zoos."
    },
    {
      id: "cathedral",
      name: "St. Philomena's Cathedral",
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=1200",
      rating: 4.6,
      price: "Free",
      duration: "1 Hour",
      description: "Magnificent Neo-Gothic cathedral."
    }
  ],
   coorg: [
    {
      id: "abbeyfalls",
      name: "Abbey Falls",
      rating: 4.7,
      price: "₹50",
      duration: "1 Hour",
      description: "Popular waterfall surrounded by coffee plantations."
    },
    {
      id: "rajasseat",
      name: "Raja's Seat",
      rating: 4.6,
      price: "₹20",
      duration: "1 Hour",
      description: "Scenic viewpoint famous for sunsets."
    },
    {
      id: "dubare",
      name: "Dubare Elephant Camp",
      rating: 4.7,
      price: "₹100",
      duration: "3 Hours",
      description: "Interact with and learn about elephants."
    },
    {
      id: "talacauvery",
      name: "Talacauvery",
      rating: 4.8,
      price: "Free",
      duration: "2 Hours",
      description: "Source of the River Cauvery."
    },
    {
      id: "mandalpatti",
      name: "Mandalpatti Viewpoint",
      rating: 4.8,
      price: "₹250",
      duration: "2 Hours",
      description: "Panoramic hilltop viewpoint."
    }
  ],

  munnar: [
    {
      id: "teagardens",
      name: "Tea Gardens",
      rating: 4.9,
      price: "Free",
      duration: "2 Hours",
      description: "Rolling tea plantations across the hills."
    },
    {
      id: "eravikulam",
      name: "Eravikulam National Park",
      rating: 4.8,
      price: "₹200",
      duration: "3 Hours",
      description: "Home of the Nilgiri Tahr."
    },
    {
      id: "mattupetty",
      name: "Mattupetty Dam",
      rating: 4.7,
      price: "₹100",
      duration: "2 Hours",
      description: "Scenic reservoir and boating spot."
    },
    {
      id: "echo",
      name: "Echo Point",
      rating: 4.6,
      price: "₹50",
      duration: "1 Hour",
      description: "Famous echo phenomenon viewpoint."
    },
    {
      id: "topstation",
      name: "Top Station",
      rating: 4.8,
      price: "₹50",
      duration: "2 Hours",
      description: "One of the best viewpoints in Kerala."
    }
  ],

  kodaikanal: [
    {
      id: "kodailake",
      name: "Kodaikanal Lake",
      rating: 4.8,
      price: "₹300",
      duration: "2 Hours",
      description: "Star-shaped lake with boating facilities."
    },
    {
      id: "coakerswalk",
      name: "Coaker's Walk",
      rating: 4.7,
      price: "₹30",
      duration: "1 Hour",
      description: "Scenic walking path with valley views."
    },
    {
      id: "pillarrocks",
      name: "Pillar Rocks",
      rating: 4.8,
      price: "₹20",
      duration: "1 Hour",
      description: "Famous giant rock formations."
    },
    {
      id: "pineforest",
      name: "Pine Forest",
      rating: 4.6,
      price: "₹20",
      duration: "1 Hour",
      description: "Beautiful forest popular for photography."
    },
    {
      id: "gunacaves",
      name: "Guna Caves",
      rating: 4.7,
      price: "₹25",
      duration: "1 Hour",
      description: "Mysterious caves surrounded by dense forest."
    }
  ],
  bangalore: [
  {
    id: "lalbagh",
    name: "Lalbagh Botanical Garden",
    rating: 4.8,
    price: "₹30",
    duration: "2 Hours",
    description: "Historic botanical garden with rare plants."
  },
  {
    id: "cubbon",
    name: "Cubbon Park",
    rating: 4.7,
    price: "Free",
    duration: "2 Hours",
    description: "Large green space in the heart of Bengaluru."
  },
  {
    id: "palace",
    name: "Bangalore Palace",
    rating: 4.6,
    price: "₹240",
    duration: "2 Hours",
    description: "Royal palace inspired by Windsor Castle."
  },
  {
    id: "iskcon",
    name: "ISKCON Temple",
    rating: 4.8,
    price: "Free",
    duration: "1.5 Hours",
    description: "One of India's largest ISKCON temples."
  },
  {
    id: "bannerghatta",
    name: "Bannerghatta National Park",
    rating: 4.7,
    price: "₹350",
    duration: "Half Day",
    description: "Wildlife safari and zoo experience."
  }
],

chennai: [
  {
    id: "marina",
    name: "Marina Beach",
    rating: 4.8,
    price: "Free",
    duration: "2 Hours",
    description: "India's longest urban beach."
  },
  {
    id: "kapaleeshwarar",
    name: "Kapaleeshwarar Temple",
    rating: 4.8,
    price: "Free",
    duration: "1 Hour",
    description: "Historic Dravidian-style temple."
  },
  {
    id: "fortstgeorge",
    name: "Fort St. George",
    rating: 4.5,
    price: "₹25",
    duration: "2 Hours",
    description: "First British fortress in India."
  },
  {
    id: "governmentmuseum",
    name: "Government Museum",
    rating: 4.6,
    price: "₹50",
    duration: "2 Hours",
    description: "One of India's oldest museums."
  },
  {
    id: "vivekananda",
    name: "Vivekananda House",
    rating: 4.6,
    price: "₹20",
    duration: "1 Hour",
    description: "Historic residence of Swami Vivekananda."
  }
],

kochi: [
  {
    id: "fortkochi",
    name: "Fort Kochi",
    rating: 4.8,
    price: "Free",
    duration: "Half Day",
    description: "Historic colonial district of Kochi."
  },
  {
    id: "chinesenets",
    name: "Chinese Fishing Nets",
    rating: 4.7,
    price: "Free",
    duration: "1 Hour",
    description: "Iconic fishing nets along the waterfront."
  },
  {
    id: "mattancherry",
    name: "Mattancherry Palace",
    rating: 4.6,
    price: "₹20",
    duration: "1.5 Hours",
    description: "Portuguese-built palace and museum."
  },
  {
    id: "jewtown",
    name: "Jew Town",
    rating: 4.6,
    price: "Free",
    duration: "2 Hours",
    description: "Historic neighborhood with antique shops."
  },
  {
    id: "marine",
    name: "Marine Drive",
    rating: 4.7,
    price: "Free",
    duration: "2 Hours",
    description: "Popular waterfront promenade."
  }
],

pondicherry: [
  {
    id: "rockbeach",
    name: "Rock Beach",
    rating: 4.8,
    price: "Free",
    duration: "2 Hours",
    description: "Scenic beachfront promenade."
  },
  {
    id: "auroville",
    name: "Auroville",
    rating: 4.8,
    price: "Free",
    duration: "Half Day",
    description: "Experimental international township."
  },
  {
    id: "matrimandir",
    name: "Matrimandir",
    rating: 4.9,
    price: "Free",
    duration: "2 Hours",
    description: "Golden meditation center."
  },
  {
    id: "frenchquarter",
    name: "French Quarter",
    rating: 4.8,
    price: "Free",
    duration: "2 Hours",
    description: "Colorful colonial streets and cafés."
  },
  {
    id: "paradise",
    name: "Paradise Beach",
    rating: 4.7,
    price: "₹150",
    duration: "Half Day",
    description: "Beautiful beach accessible by boat."
  }
],
};