
import { ServicePackage, Banner, ContactInfo } from './types';

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'bjk-01',
    name: "BJK WASH -01",
    description: "Our basic comprehensive cleaning package to keep your car looking fresh.",
    items: [
      "1 Time Waterwash cleaning",
      "1 Time Interior cleaning",
      "1 Time Vacuum cleaning",
      "1 Time Wheel cleaning",
      "First-cleaning package"
    ],
    price: 800
  },
  {
    id: 'bjk-02',
    name: "BJK-02",
    description: "The double-deep clean for those who want that showroom shine inside and out.",
    items: [
      "2 Time Waterwash cleaning",
      "2 Time Interior cleaning",
      "2 Time Vacuum cleaning",
      "2 Time Wheel cleaning",
      "Second-cleaning package"
    ],
    price: 1000,
    featured: true
  },
  {
    id: 'bjk-03',
    name: "BJK-03",
    description: "Premium steamer package for high-pressure sanitization and elite polishing.",
    items: [
      "1 Time steamer Cleaning",
      "1 Time inter steamer Cleaning",
      "1 time inter polish cleaning",
      "Three- cleaning package"
    ],
    price: 1500
  }
];

export const BANNERS: Banner[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=1920",
    title: "Monsoon Deep Clean",
    subtitle: "Protect your paint from muddy rains with our special coating.",
    seasonTag: "Rainy Season Special"
  },
  {
    id: 2,
    image: "/BJK01.png",
    title: "Summer Shine Package",
    subtitle: "Beat the dust and heat. Keep your car cool and sparkling.",
    seasonTag: "Summer Glow"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=1920",
    title: "Elite Mobile Service",
    subtitle: "Professional detailing delivered to your doorstep.",
    seasonTag: "Anytime Premium"
  }
];

export const CONTACT: ContactInfo = {
  phones: ["+91 9884774881", "+91 7305298707"],
  gpay: "9345674881",
  whatsapp: "+919884774881"
};
