import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Leaf, Dog, Store, Sprout, ArrowRight, RefreshCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Profile() {
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    farmingType: '',
    cropType: '',
    animalType: '',
    isAgrovet: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerFarm } = useAuth();
  const navigate = useNavigate();

  const plantTypes = [
    'Maize', 'Tomatoes', 'Beans', 'Potatoes', 'Cabbage', 'Kales', 'Wheat', 'Rice', 'Coffee', 'Tea',
  ];

  const animalTypes = [
    'Dairy Cows', 'Beef Cattle', 'Poultry', 'Goats', 'Sheep', 'Pigs', 'Fish',
  ];

  const requestLocation = () => {
    setLoadingLocation(true);
    setLocationError(null);
    
    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation not supported by your browser');
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: 'High-Precision GPS Lock'
        });
        setLoadingLocation(false);
        setLocationError(null);
      },
      (error) => {
        console.error('Error getting location:', error);
        let msg = 'Location access denied. Please enable GPS for accurate weather data.';
        if (error.code === 3) msg = 'Location request timed out. Try again.';
        setLocationError(msg);
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!location && !formData.isAgrovet) {
      setError('GPS Coordinates are required to enable hyper-local weather monitoring.');
      return;
    }

    setLoading(true);

    if (!formData.name) {
      setError('Farm/Agrovet name is required');
      setLoading(false);
      return;
    }

    if (!formData.isAgrovet) {
      if (!formData.farmingType) {
        setError('Please select a farming type');
        setLoading(false);
        return;
      }
      if (formData.farmingType === 'plant' && !formData.cropType) {
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

    try {
      await registerFarm({
        name: formData.name,
        location,
        type: formData.farmingType,
        cropType: formData.farmingType === 'plant' ? formData.cropType : formData.animalType,
        isAgrovet: formData.isAgrovet
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4 py-12 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-surface-200"
      >
        <div className="bg-primary-600 text-white p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="flex justify-center mb-4 relative z-10">
            <div className="bg-white p-3 rounded-2xl">
               <Sprout className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tight relative z-10">Farm Initialization</h1>
          <p className="text-primary-100 font-bold uppercase tracking-widest text-xs relative z-10">Link IoT Telemetry to GPS Coordinates</p>
        </div>

        <div className="p-10">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl mb-6 font-bold text-sm flex items-center space-x-3">
              <div className="bg-rose-500 w-1.5 h-1.5 rounded-full"></div>
              <span>{error}</span>
            </div>
          )}

          <div className={`rounded-2xl p-5 mb-8 border transition-all ${
            location 
              ? 'bg-emerald-50 border-emerald-200' 
              : locationError 
                ? 'bg-rose-50 border-rose-200' 
                : 'bg-surface-50 border-surface-200'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-xl mt-0.5 ${
                  location ? 'bg-emerald-100 text-emerald-600' : 'bg-surface-200 text-surface-400'
                }`}>
                   <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                    location ? 'text-emerald-700' : 'text-surface-500'
                  }`}>
                    {loadingLocation ? 'Acquiring GPS Lock...' : location ? 'Satellite Signal Locked' : 'GPS Signal Missing'}
                  </p>
                  
                  {loadingLocation ? (
                    <p className="text-sm font-bold text-surface-600 animate-pulse italic">Connecting to GNSS constellation...</p>
                  ) : location ? (
                    <div>
                      <p className="text-sm font-black text-emerald-900 leading-none mb-1">Coordinates Captured</p>
                      <p className="text-[10px] font-bold text-emerald-600/70 uppercase">
                        Lat: {location.lat.toFixed(6)} | Lng: {location.lng.toFixed(6)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-rose-600">{locationError || 'Please allow location access for hyper-local AI insights.'}</p>
                  )}
                </div>
              </div>
              
              {!loadingLocation && (
                <button 
                  type="button"
                  onClick={requestLocation}
                  className="text-[10px] font-black uppercase tracking-tighter bg-white border border-surface-200 px-3 py-2 rounded-xl hover:bg-surface-50 transition-all text-surface-600 flex items-center"
                >
                  <RefreshCcw className="h-3 w-3 mr-1" />
                  Reset GPS
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-xs font-black text-surface-400 uppercase tracking-widest mb-2.5">
                Farm / Operation Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Green Valley Farm"
                className="w-full px-5 py-4 bg-surface-50 border border-surface-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold text-surface-900"
              />
            </div>

            <div className="border border-surface-200 rounded-2xl p-5 hover:border-primary-300 transition-colors">
              <label className="flex items-center space-x-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAgrovet}
                  onChange={(e) => setFormData({ ...formData, isAgrovet: e.target.checked, farmingType: '', cropType: '', animalType: '' })}
                  className="w-6 h-6 text-primary-600 rounded-lg border-surface-300 focus:ring-primary-500"
                />
                <div className="bg-surface-100 p-2 rounded-xl text-surface-600">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-black text-surface-900">I operate an Agrovet</p>
                  <p className="text-xs font-bold text-surface-500">Skip farm telemetry and access marketplace directly</p>
                </div>
              </label>
            </div>

            {!formData.isAgrovet && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-8">
                <div>
                  <label className="block text-xs font-black text-surface-400 uppercase tracking-widest mb-3">
                    Primary Operation Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, farmingType: 'plant', animalType: '' })}
                      className={`p-6 border-2 rounded-2xl transition-all ${
                        formData.farmingType === 'plant'
                          ? 'border-primary-500 bg-primary-50 shadow-md shadow-primary-100'
                          : 'border-surface-200 hover:border-primary-200 hover:bg-surface-50'
                      }`}
                    >
                      <Leaf className={`h-8 w-8 mx-auto mb-3 ${
                        formData.farmingType === 'plant' ? 'text-primary-600' : 'text-surface-400'
                      }`} />
                      <p className={`font-black text-sm ${formData.farmingType === 'plant' ? 'text-primary-900' : 'text-surface-600'}`}>Crop Farming</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, farmingType: 'animal', cropType: '' })}
                      className={`p-6 border-2 rounded-2xl transition-all ${
                        formData.farmingType === 'animal'
                          ? 'border-primary-500 bg-primary-50 shadow-md shadow-primary-100'
                          : 'border-surface-200 hover:border-primary-200 hover:bg-surface-50'
                      }`}
                    >
                      <Dog className={`h-8 w-8 mx-auto mb-3 ${
                        formData.farmingType === 'animal' ? 'text-primary-600' : 'text-surface-400'
                      }`} />
                      <p className={`font-black text-sm ${formData.farmingType === 'animal' ? 'text-primary-900' : 'text-surface-600'}`}>Livestock</p>
                    </button>
                  </div>
                </div>

                {formData.farmingType === 'plant' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <label className="block text-xs font-black text-surface-400 uppercase tracking-widest mb-2.5">
                      Primary Crop
                    </label>
                    <select
                      value={formData.cropType}
                      onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                      className="w-full px-5 py-4 bg-surface-50 border border-surface-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold text-surface-900 appearance-none"
                    >
                      <option value="">Select a crop type...</option>
                      {plantTypes.map((plant) => (
                        <option key={plant} value={plant}>{plant}</option>
                      ))}
                    </select>
                  </motion.div>
                )}

                {formData.farmingType === 'animal' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <label className="block text-xs font-black text-surface-400 uppercase tracking-widest mb-2.5">
                      Primary Livestock
                    </label>
                    <select
                      value={formData.animalType}
                      onChange={(e) => setFormData({ ...formData, animalType: e.target.value })}
                      className="w-full px-5 py-4 bg-surface-50 border border-surface-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold text-surface-900 appearance-none"
                    >
                      <option value="">Select livestock type...</option>
                      {animalTypes.map((animal) => (
                        <option key={animal} value={animal}>{animal}</option>
                      ))}
                    </select>
                  </motion.div>
                )}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || loadingLocation}
              className="w-full bg-primary-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all disabled:bg-surface-300 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Initialize Dashboard</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
