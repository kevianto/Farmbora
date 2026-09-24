const Product = require('../models/Product');

// Simulated dynamic price fluctuation for exhibition
const fluctuatePrice = (basePrice) => {
  const fluctuation = (Math.random() * 0.05) - 0.025; // -2.5% to +2.5%
  return Math.round(basePrice * (1 + fluctuation));
};

const seedProducts = [
  {
    seller: "Green Harvest Agrovets",
    sellerType: "agrovet",
    product: "Maize HB614 Premium Hybrid Seeds",
    price: 3450,
    quantity: "10kg Bag",
    image: "https://images.unsplash.com/photo-1551739440-5dd934d3a94a?auto=format&fit=crop&q=80&w=400",
    location: "Nakuru",
    contact: "info@greenharvest.com",
    trend: "up"
  },
  {
    seller: "Farmer John Kamau",
    sellerType: "farmer",
    product: "Organic Red Kidney Beans",
    price: 130,
    quantity: "1kg",
    image: "https://images.unsplash.com/photo-1550291652-6ea9114a47b1?auto=format&fit=crop&q=80&w=400",
    location: "Eldoret",
    contact: "0712345678",
    trend: "stable"
  },
  {
    seller: "Mary Wanjiru",
    sellerType: "farmer",
    product: "Fresh Grade-A Tomatoes",
    price: 1200,
    quantity: "15kg Crate",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400",
    location: "Kiambu",
    contact: "0711223344",
    trend: "up"
  },
  {
    seller: "FarmTech Agrovet",
    sellerType: "agrovet",
    product: "NPK 17:17:17 Planting Fertilizer",
    price: 4500,
    quantity: "50kg Bag",
    image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=400",
    location: "Nairobi",
    contact: "+254722334455",
    trend: "down"
  },
  {
    seller: "Peter Omondi",
    sellerType: "farmer",
    product: "Fresh Pure Farm Milk",
    price: 70,
    quantity: "1 Liter",
    image: "https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&q=80&w=400",
    location: "Bomet",
    contact: "0733445566",
    trend: "up"
  },
  {
    seller: "Livestock Pro Agrovets",
    sellerType: "agrovet",
    product: "High-Protein Dairy Meal",
    price: 2800,
    quantity: "50kg Bag",
    image: "https://images.unsplash.com/photo-1535090467336-9501f96eef89?auto=format&fit=crop&q=80&w=400",
    location: "Nyeri",
    contact: "orders@livestockpro.co.ke",
    trend: "stable"
  },
  {
    seller: "SmartIrrigate Ltd",
    sellerType: "agrovet",
    product: "Drip Irrigation Starter Kit",
    price: 15500,
    quantity: "1/4 Acre Set",
    image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=400",
    location: "Thika",
    contact: "tech@smartirrigate.com",
    trend: "stable"
  },
  {
    seller: "Murang'a Farmers Co-op",
    sellerType: "farmer",
    product: "Export Grade Hass Avocados",
    price: 1800,
    quantity: "20kg Box",
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=400",
    location: "Murang'a",
    contact: "0799887766",
    trend: "up"
  }
];

exports.getAllProducts = async (req, res) => {
  console.log("Market request received at:", new Date().toLocaleTimeString());
  try {
    let products = await Product.find().sort({ createdAt: -1 });
    // IF DATABASE IS EMPTY OR HAS OUTDATED PRODUCT COUNT, FORCE SEED FOR EXHIBITION
    if (products.length !== seedProducts.length) {
      console.log("Seeding fresh simulated products...");
      await Product.deleteMany({}); // Clear potentially broken/empty data
      await Product.insertMany(seedProducts);
      products = await Product.find().sort({ createdAt: -1 });
    }

    // Simulate real-time price movement
    const simulatedProducts = products.map(p => {
      const productObj = p.toObject();
      productObj.price = fluctuatePrice(productObj.price);
      return productObj;
    });
    
    res.json({ products: simulatedProducts });
  } catch (error) {
    console.error("Market Controller Error:", error.message);
    res.status(500).json({ message: "Market fetch error", error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Error creating listing", error: error.message });
  }
};
