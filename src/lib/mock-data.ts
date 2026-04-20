export type MockProduct = {
  id: string;
  name: string;
  description: string;
  priceGHS: number;
  category: string;
  ratingAvg: number;
  images: string[];
};

export type MockService = {
  id: string;
  name: string;
  description: string;
  priceGHS: number;
  category: string;
  provider: string;
  images: string[];
};

export type MockJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "REMOTE";
  description: string;
};

export const CATEGORIES = [
  "Logistics",
  "Jobs",
  "Tech",
  "Travel",
  "Cleaning",
  "Kitchen",
  "Events",
  "Home Care",
  "Health",
  "Education",
] as const;

export const mockProducts: MockProduct[] = [
  {
    id: "p-1",
    name: "Air Fryer (4L)",
    description: "Crispy meals with less oil. Energy efficient.",
    priceGHS: 850,
    category: "Kitchen",
    ratingAvg: 4.6,
    images: ["/placeholders/placeholder.svg"],
  },
  {
    id: "p-2",
    name: "Smartwatch Pro",
    description: "Health tracking, calls, and notifications.",
    priceGHS: 420,
    category: "Tech",
    ratingAvg: 4.3,
    images: ["/placeholders/placeholder.svg"],
  },
  {
    id: "p-3",
    name: "Cleaning Starter Kit",
    description: "All-in-one home cleaning bundle.",
    priceGHS: 190,
    category: "Cleaning",
    ratingAvg: 4.2,
    images: ["/placeholders/placeholder.svg"],
  },
];

export const mockServices: MockService[] = [
  {
    id: "s-1",
    name: "Home Deep Cleaning",
    description: "2–4 hours professional cleaning with supplies included.",
    priceGHS: 250,
    category: "Cleaning",
    provider: "Ama’s Clean Team",
    images: ["/placeholders/placeholder.svg"],
  },
  {
    id: "s-2",
    name: "Laptop Repair & Tune-up",
    description: "Diagnostics, fixes, and performance boost.",
    priceGHS: 180,
    category: "Tech",
    provider: "Kofi Tech",
    images: ["/placeholders/placeholder.svg"],
  },
  {
    id: "s-3",
    name: "Event MC Booking",
    description: "Professional MC for weddings, corporate and parties.",
    priceGHS: 600,
    category: "Events",
    provider: "Nana Host",
    images: ["/placeholders/placeholder.svg"],
  },
];

export const mockJobs: MockJob[] = [
  {
    id: "j-1",
    title: "Customer Support Representative",
    company: "Bestie Logistics",
    location: "Accra",
    type: "FULL_TIME",
    description: "Handle customer inquiries, track orders, and resolve issues.",
  },
  {
    id: "j-2",
    title: "Frontend Developer (Next.js)",
    company: "GhanaTech Studio",
    location: "Remote",
    type: "REMOTE",
    description: "Build scalable UI with Next.js App Router and Tailwind.",
  },
];

