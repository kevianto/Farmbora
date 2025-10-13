import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Leaf, Dog, Store, Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Profile() {
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [formData, setFormData] = useState({
    farmingType: '',
    plantType: '',
    animalType: '',
    isAgrovet: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocation({
            latitude: -1.2921,
            longitude: 36.8219,
            city: 'Nairobi',
            country: 'Kenya',
          });
          setLoadingLocation(false);
        }
      );
    } else {
      setLocation({
        latitude: -1.2921,
        longitude: 36.8219,
        city: 'Nairobi',
        country: 'Kenya',
      });
      setLoadingLocation(false);
    }
  }, []);

  const plantTypes = [
    'Maize',
    'Tomatoes',
    'Beans',
    'Potatoes',
    'Cabbage',
    'Kales',
    'Wheat',
    'Rice',
    'Coffee',
    'Tea',
  ];

  const animalTypes = [
    'Dairy Cows',
    'Beef Cattle',
    'Poultry',
    'Goats',
    'Sheep',
    'Pigs',
    'Fish (Aquaculture)',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.isAgrovet) {
      if (!location) {
        setError('Location is required');
        setLoading(false);
        return;
      }
    } else {
      if (!formData.farmingType) {
        setError('Please select a farming type');
        setLoading(false);
        return;
      }

      if (formData.farmingType === 'plant' && !formData.plantType) {
        setError('Please select a plant type');
        setLoading(false);
        return;
      }

      if (formData.farmingType === 'animal' && !formData.animalType) {
        setError('Please select an animal type');
        setLoading(false);
        return;
      }
    }

    setTimeout(() => {
      const profileData = {
        ...formData,
        location,
        userId: user.id,
        createdAt: new Date().toISOString(),
      };

      updateProfile(profileData);
      navigate('/dashboard');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
      >
        <div className="bg-green-600 text-white p-8 text-center">
          <div className="flex justify-center mb-4">
            <Sprout className="h-16 w-16" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-green-100">Tell us about your farming to get personalized insights</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Location Detected</p>
                {loadingLocation ? (
                  <p className="text-sm text-blue-700">Detecting your location...</p>
                ) : (
                  <p className="text-sm text-blue-700">
                    Lat: {location?.latitude.toFixed(4)}, Long: {location?.longitude.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-gray-200 rounded-lg p-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAgrovet}
                  onChange={(e) => setFormData({ ...formData, isAgrovet: e.target.checked, farmingType: '', plantType: '', animalType: '' })}
                  className="w-5 h-5 text-green-600"
                />
                <Store className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-800">I own an agrovet</p>
                  <p className="text-sm text-gray-600">Skip farming details and access marketplace only</p>
                </div>
              </label>
            </div>

            {!formData.isAgrovet && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What type of farming do you do?
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, farmingType: 'plant', animalType: '' })}
                      className={`p-6 border-2 rounded-lg transition-all ${
                        formData.farmingType === 'plant'
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <Leaf className={`h-12 w-12 mx-auto mb-3 ${
                        formData.farmingType === 'plant' ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <p className="font-semibold text-gray-800">Plant Farming</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, farmingType: 'animal', plantType: '' })}
                      className={`p-6 border-2 rounded-lg transition-all ${
                        formData.farmingType === 'animal'
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <Dog className={`h-12 w-12 mx-auto mb-3 ${
                        formData.farmingType === 'animal' ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <p className="font-semibold text-gray-800">Animal Farming</p>
                    </button>
                  </div>
                </div>

                {formData.farmingType === 'plant' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select the type of plant
                    </label>
                    <select
                      value={formData.plantType}
                      onChange={(e) => setFormData({ ...formData, plantType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Choose a plant...</option>
                      {plantTypes.map((plant) => (
                        <option key={plant} value={plant}>{plant}</option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.farmingType === 'animal' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select the type of animal
                    </label>
                    <select
                      value={formData.animalType}
                      onChange={(e) => setFormData({ ...formData, animalType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Choose an animal...</option>
                      {animalTypes.map((animal) => (
                        <option key={animal} value={animal}>{animal}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading || loadingLocation}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving Profile...' : 'Continue to Dashboard'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
