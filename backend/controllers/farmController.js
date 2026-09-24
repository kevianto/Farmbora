const Farm = require('../models/Farm');

exports.registerFarm = async (req, res) => {
  const { name, location, type, cropType, isAgrovet } = req.body;
  const userId = req.user.id;

  try {
    const existingFarm = await Farm.findOne({ userId });
    if (existingFarm) {
      return res.status(400).json({ message: 'User already has a farm registered' });
    }

    const newFarm = await Farm.create({
      userId,
      name: name || 'My Farm',
      location: location || { lat: -1.2921, lng: 36.8219, address: 'Nairobi, Kenya' },
      type: type || 'plant',
      cropType: cropType || 'Maize',
      isAgrovet: isAgrovet || false
    });

    res.status(201).json({ message: 'Farm registered successfully', farm: newFarm });
  } catch (error) {
    res.status(500).json({ message: 'Server error during farm registration', error: error.message });
  }
};

exports.getFarm = async (req, res) => {
  const userId = req.user.id;
  try {
    const farm = await Farm.findOne({ userId });
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found for this user' });
    }
    res.json({ farm });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching farm', error: error.message });
  }
};
