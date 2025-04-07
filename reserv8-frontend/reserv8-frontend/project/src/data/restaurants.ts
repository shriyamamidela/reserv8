export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  description?: string;
  image?: string;
  priceRange?: string;
  openingHours?: string;
  address?: string;
}

export const restaurants: Restaurant[] = [
  {
    id: "broadway",
    name: "Broadway",
    cuisine: "Multi-cuisine",
    location: "Jubilee Hills",
    rating: 4.5,
    description: "A popular restaurant serving a variety of cuisines",
    image: "/images/broadway.jpg",
    priceRange: "₹₹₹",
    openingHours: "11:00 AM - 11:00 PM",
    address: "Road No. 36, Jubilee Hills, Hyderabad"
  },
  {
    id: "antera",
    name: "Antera",
    cuisine: "Italian",
    location: "Gachibowli",
    rating: 4.3,
    description: "Authentic Italian cuisine in a modern setting",
    image: "/images/antera.png",
    priceRange: "₹₹₹₹",
    openingHours: "12:00 PM - 10:00 PM",
    address: "Financial District, Gachibowli, Hyderabad"
  },
  {
    id: "ishtaa",
    name: "Ishtaa",
    cuisine: "Indian",
    location: "Gachibowli",
    rating: 4.7,
    description: "Contemporary Indian cuisine with a modern twist",
    image: "/images/ishtaa.png",
    priceRange: "₹₹₹",
    openingHours: "12:30 PM - 11:00 PM",
    address: "Financial District, Gachibowli, Hyderabad"
  },
  // Add more restaurants as needed
]; 