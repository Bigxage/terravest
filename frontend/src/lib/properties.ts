export type PropertyCategory = "estate" | "development" | "land";

export type Property = {
  id: number;
  title: string;
  location: string;
  pricePerUnit: number; // USD per unit
  totalUnits: number;
  availableUnits: number;
  roi: string;
  image: string;
  initialized: boolean;
  category: PropertyCategory;
};

export const demoProperties: Property[] = [
  {
    id: 1,
    title: "Imperial Villa – Karsana",
    location: "Karsana, Abuja",
    pricePerUnit: 1.5,
    totalUnits: 10000,
    availableUnits: 8200,
    roi: "18–25%",
    image: "/images/imperial-villa.jpg",
    initialized: true,
    category: "development",
  },
  {
    id: 2,
    title: "Harmonies Homes – Kuje",
    location: "Kuje, Abuja",
    pricePerUnit: 0.8,
    totalUnits: 8000,
    availableUnits: 8000,
    roi: "25–40%",
    image: "/images/kuje-homes.jpg",
    initialized: true,
    category: "land",
  },
  {
    id: 3,
    title: "Nova Garden – Kurudu",
    location: "Kurudu, Abuja",
    pricePerUnit: 0.5,
    totalUnits: 12000,
    availableUnits: 12000,
    roi: "30–50%",
    image: "/images/nova-garden.jpg",
    initialized: true,
    category: "land",
  },
  {
    id: 4,
    title: "Abundance City – Apo Tafyi",
    location: "Apo Tafyi, Abuja",
    pricePerUnit: 1.2,
    totalUnits: 9000,
    availableUnits: 7500,
    roi: "20–35%",
    image: "/images/apo-city.jpg",
    initialized: true,
    category: "estate",
  },
  {
    id: 5,
    title: "Skyline Exclusive – Gousa",
    location: "Gousa, Abuja",
    pricePerUnit: 2.0,
    totalUnits: 7000,
    availableUnits: 7000,
    roi: "25–50%",
    image: "/images/gousa-skyline.jpg",
    initialized: true,
    category: "development",
  },
];