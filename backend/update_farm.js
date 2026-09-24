const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Farm = require('./models/Farm');
const User = require('./models/User');

dotenv.config();

const updateLocation = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: 'kamau@gmail.com' });
    if (!user) {
      console.error('User not found');
      process.exit(1);
    }

    const result = await Farm.findOneAndUpdate(
      { userId: user._id },
      { 
        location: { 
          lat: 0.2858, 
          lng: 34.7645, 
          address: "Kakamega MMUST University" 
        } 
      },
      { upsert: true, new: true }
    );

    console.log('Farm location updated:', result.location);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

updateLocation();
