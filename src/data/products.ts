import banginapalli from "@/assets/mango-banginapalli.jpg";
import himamPasand from "@/assets/mango-himam-pasand.jpg";
import groundnuts from "@/assets/groundnuts.jpg";
import groundnutOil from "@/assets/groundnut-oil.jpg";
import kaju from "@/assets/kaju.png";
import medjoolDates from "@/assets/medjool-dates.png";
import medjoolDatesLarge from "@/assets/medjool-dates-large.jpg";

export type Product = {
  id: string;
  name: string;
  origin: string;
  description: string;
  /** Price in INR per box */
  price: number;
  weight: string;
  image: string;
  badge?: string;
  /** Approx calories per 100g (or per 100ml for oil) */
  calories: string;
  /** Mark true to show as Out of stock and disable add-to-cart */
  outOfStock?: boolean;
};

export const products: Product[] = [
  {
    id: "himam-pasand",
    name: "Himam Pasand",
    origin: "Andhra Pradesh",
    description: "Royal mango. Fibre-less, fragrant and naturally ripened.",
    price: 1000,
    weight: "5 kg",
    image: himamPasand,
    badge: "Premium",
    calories: "60 kcal / 100g",
  },
  {
    id: "banginapalli",
    name: "Banginapalli",
    origin: "Andhra Pradesh",
    description: "Golden, fibre-free and buttery sweet.",
    price: 500,
    weight: "5 kg",
    image: banginapalli,
    badge: "Bestseller",
    calories: "60 kcal / 100g",
  },
  {
    id: "medjool-dates-jumbo",
    name: "Medjool Dates — Jumbo",
    origin: "Premium Grade",
    description: "Jumbo, soft and caramel-rich.",
    price: 950,
    weight: "1 kg pack",
    image: medjoolDates,
    badge: "Jumbo",
    calories: "277 kcal / 100g",
  },
  {
    id: "medjool-dates-large",
    name: "Medjool Dates — Large",
    origin: "Premium Grade",
    description: "Chewy, honey-sweet everyday treat.",
    price: 1000,
    weight: "1 kg pack",
    image: medjoolDatesLarge,
    calories: "277 kcal / 100g",
  },
  {
    id: "kaju",
    name: "Kaju (Cashews)",
    origin: "Premium Grade",
    description: "Whole, creamy and buttery cashews.",
    price: 1300,
    weight: "1 kg pack",
    image: kaju,
    calories: "553 kcal / 100g",
  },
  {
    id: "groundnuts",
    name: "Groundnuts",
    origin: "Andhra Pradesh",
    description: "Sun-dried, crunchy farm-fresh groundnuts.",
    price: 190,
    weight: "1 kg pack",
    image: groundnuts,
    calories: "567 kcal / 100g",
  },
  {
    id: "groundnut-oil",
    name: "Cold-pressed Groundnut Oil",
    origin: "Andhra Pradesh",
    description: "Wood-pressed, unrefined and aromatic.",
    price: 350,
    weight: "1 litre bottle",
    image: groundnutOil,
    badge: "Cold-pressed",
    calories: "884 kcal / 100ml",
  },
];

export const findProduct = (id: string) => products.find((p) => p.id === id);
