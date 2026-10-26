const products = [
  {
    id: "1",
    name: "Mango Tree Sapling",
    category: "Plants",
    price: 450,
    rating: 4.9,
    stock: 25,
    description:
      "Healthy mango sapling suitable for home gardens and orchards.",
    image: "https://tse1.mm.bing.net/th/id/OIP.aKKuxXGe4WgCMzqtlKydwQHaJ4?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },

  {
    id: "2",
    name: "Guava Plant",
    category: "Plants",
    price: 280,
    rating: 4.8,
    stock: 20,
    description: "High-yield guava plant that grows well in Bangladesh.",
    image: "https://tse1.mm.bing.net/th/id/OIP.6KLpPBiWRiD7WrGOsU_abgHaJ4?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },

  {
    id: "3",
    name: "Clay Flower Pot",
    category: "Pots",
    price: 120,
    rating: 4.7,
    stock: 40,
    description:
      "Traditional terracotta pot ideal for indoor and outdoor plants.",
    image: "https://tse1.explicit.bing.net/th/id/OIP.xrpSKcFpbdd7xU5cEwQMhAHaGV?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },

  {
    id: "4",
    name: "Vermicompost Organic Fertilizer",
    category: "Fertilizers",
    price: 180,
    rating: 4.9,
    stock: 60,
    description:
      "Organic vermicompost that improves soil fertility and plant growth.",
    image: "https://tse1.mm.bing.net/th/id/OIP.KE5ma4NIt2pDZuzlyq9k5QHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },

  {
    id: "5",
    name: "Garden Watering Can",
    category: "Tools",
    price: 250,
    rating: 4.8,
    stock: 18,
    description: "Durable watering can for everyday gardening and plant care.",
    image: "https://i5.walmartimages.com/seo/Wzzjkit-Watering-Can-Indoor-Plants-Long-Spout-Watering-Can-Outdoor-Flower-Patterns-Indoor-Watering-Can-Handle-Plastic-Plant-Watering-Can-Garden-Plant_8b273477-c2d8-4206-a62f-7fda0970bea1.033b96f50e8577101a2e19aef847748f.jpeg",
  },

  {
    id: "6",
    name: "BRRI Rice Seeds",
    category: "Seeds",
    price: 90,
    rating: 4.9,
    stock: 120,
    description:
      "High-quality BRRI rice seeds suitable for cultivation in Bangladesh.",
    image: "https://tse1.mm.bing.net/th/id/OIP.08MlnJZ9eldrFpuqLb3dyAHaHa?r=0&w=500&h=500&rs=1&pid=ImgDetMain&o=7&rm=3",
  },

  {
    id: "7",
    name: "Jackfruit Sapling",
    category: "Plants",
    price: 380,
    rating: 4.8,
    stock: 15,
    description: "Healthy jackfruit sapling with excellent fruit production.",
    image: "https://tse3.mm.bing.net/th/id/OIP.iiJe4qvpuxYEw8wZUifv6wAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },

  {
    id: "8",
    name: "Coconut Tree Sapling",
    category: "Plants",
    price: 500,
    rating: 4.7,
    stock: 18,
    description: "Young coconut tree ideal for tropical home gardens.",
    image: "https://tse3.mm.bing.net/th/id/OIP.jTzhtW9of4tLbLOFmvghPgHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },

  {
    id: "9",
    name: "Bottle Gourd Seeds",
    category: "Seeds",
    price: 60,
    rating: 4.8,
    stock: 150,
    description: "Premium bottle gourd seeds with high germination rate.",
    image: "https://tse3.mm.bing.net/th/id/OIP.ekeKp73pv8IenMO4ixAhEAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },

  {
    id: "10",
    name: "Hand Garden Trowel",
    category: "Tools",
    price: 150,
    rating: 4.6,
    stock: 35,
    description:
      "Strong steel trowel for digging, transplanting, and gardening tasks.",
    image: "https://tse3.mm.bing.net/th/id/OIP.aJ5M5laNeU4wfYrk-mVYtQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
    {
    id: "11",
    name: "Lemon Tree Sapling",
    category: "Plants",
    price: 220,
    rating: 4.8,
    stock: 30,
    description: "Grafted lemon sapling that fruits early and thrives in home gardens.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgPqpgD3h1mBDHdLMSeJwZU7Okdx8gUIFg1rFjM1B_Jg&s=10",
  },

  {
    id: "12",
    name: "Papaya Plant",
    category: "Plants",
    price: 150,
    rating: 4.7,
    stock: 35,
    description: "Fast-growing papaya plant that fruits within a year in warm weather.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR97Y3kQ_f3L6zI7ttGJY2Nbu1prHc5sauFEqhVcTQtDw&s=10",
  },

  {
    id: "13",
    name: "Hibiscus (Joba) Plant",
    category: "Plants",
    price: 200,
    rating: 4.8,
    stock: 28,
    description: "Flowering hibiscus plant with bright blooms, great for front yards.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE_-EdsHvF-xcisB_cHPaqKLbG2YRgHVtiEC_5aXR79w&s=10",
  },

  {
    id: "14",
    name: "Plastic Grow Bag (Set of 5)",
    category: "Pots",
    price: 250,
    rating: 4.6,
    stock: 80,
    description: "Durable UV-resistant grow bags ideal for rooftop and balcony gardening.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8K5qnvByLA25O65XxSmF-XmsN9zy_FPzfLmXmGC9gfA&s=10",
  },

  {
    id: "15",
    name: "Hanging Planter Pot",
    category: "Pots",
    price: 180,
    rating: 4.5,
    stock: 45,
    description: "Lightweight hanging pot with drainage holes for balconies and windows.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5pHJTVWjE-Xzxx0-FS24-QlwXi3_ftZ45hHl4GOS9Mw&s=10",
  },

  {
    id: "16",
    name: "Neem Cake Fertilizer (1 kg)",
    category: "Fertilizers",
    price: 120,
    rating: 4.7,
    stock: 70,
    description: "Natural neem cake that enriches soil and helps reduce root pests.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-AdaZwP8ajQtDCZbQmTPabuc-vrTq7eCbAZ0gXjs7cw&s=10",
  },

  {
    id: "17",
    name: "Cow Dung Compost (5 kg)",
    category: "Fertilizers",
    price: 150,
    rating: 4.8,
    stock: 90,
    description: "Well-decomposed cow dung compost for vegetables, fruits and flowers.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6f-dCuSRJGsm4u0jPM29PmxjIjR6JfsMzN61yEXaf4g&s",
  },

  {
    id: "18",
    name: "Garden Pruning Shears",
    category: "Tools",
    price: 350,
    rating: 4.7,
    stock: 22,
    description: "Sharp stainless-steel shears for trimming branches and shaping plants.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7rTM0tY5u0NRX38oouWehCnCCStuEEQRUsfQEb3b8DA&s=10",
  },

  {
    id: "19",
    name: "Chili (Morich) Seeds",
    category: "Seeds",
    price: 50,
    rating: 4.8,
    stock: 130,
    description: "High-yield chili seeds suited to Bangladesh's climate and pot growing.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoMwCOFwkwfQcKQi8eJzfVqK2YHgBqZcwQ08aeieLtHQ&s=10",
  },

  {
    id: "20",
    name: "Red Spinach (Lal Shak) Seeds",
    category: "Seeds",
    price: 40,
    rating: 4.9,
    stock: 160,
    description: "Fast-growing red spinach seeds that can be harvested in about 30 days.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5ofbFJkdeDQWsBSIJn3DEc2_fhzWX5MRF3HEInDKhwg&s=10",
  },
];

export default products;
