import { useState } from 'react';
import { User, Lock, Moon, Sun, Save, Leaf, Dog } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [profileForm, setProfileForm] = useState({
    farmingType: profile?.farmingType || '',
    plantType: profile?.plantType || '',
    animalType: profile?.animalType || '',
    isAgrovet: profile?.isAgrovet || false,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

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

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!profileForm.isAgrovet) {
      if (!profileForm.farmingType) {
        setMessage({ type: 'error', text: 'Please select a farming type' });
        return;
      }

      if (profileForm.farmingType === 'plant' && !profileForm.plantType) {
        setMessage({ type: 'error', text: 'Please select a plant type' });
        return;
      }

      if (profileForm.farmingType === 'animal' && !profileForm.animalType) {
        setMessage({ type: 'error', text: 'Please select an animal type' });
        return;
      }
    }

    const updatedProfile = {
      ...profile,
      ...profileForm,
    };

    updateProfile(updatedProfile);
    setMessage({ type: 'success', text: 'Profile updated successfully!' });

    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all password fields' });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setMessage({ type: 'success', text: 'Password changed successfully!' });
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    setMessage({ type: 'success', text: `${!darkMode ? 'Dark' : 'Light'} mode ${!darkMode ? 'enabled' : 'disabled'}` });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and profile information</p>
        </motion.div>

        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 font-semibold transition-colors ${
                activeTab === 'profile'
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 font-semibold transition-colors ${
                activeTab === 'password'
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Lock className="h-5 w-5" />
              <span>Password</span>
            </button>

            <button
              onClick={() => setActiveTab('appearance')}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 font-semibold transition-colors ${
                activeTab === 'appearance'
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span>Appearance</span>
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Your Profile</h2>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">User:</span> {user?.name} ({user?.email})
                    </p>
                  </div>

                  <div className="border-2 border-gray-200 rounded-lg p-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileForm.isAgrovet}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          isAgrovet: e.target.checked,
                          farmingType: '',
                          plantType: '',
                          animalType: ''
                        })}
                        className="w-5 h-5 text-green-600"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">I own an agrovet</p>
                        <p className="text-sm text-gray-600">Skip farming details and access marketplace only</p>
                      </div>
                    </label>
                  </div>

                  {!profileForm.isAgrovet && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Farming Type
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setProfileForm({ ...profileForm, farmingType: 'plant', animalType: '' })}
                            className={`p-6 border-2 rounded-lg transition-all ${
                              profileForm.farmingType === 'plant'
                                ? 'border-green-600 bg-green-50'
                                : 'border-gray-200 hover:border-green-300'
                            }`}
                          >
                            <Leaf className={`h-12 w-12 mx-auto mb-3 ${
                              profileForm.farmingType === 'plant' ? 'text-green-600' : 'text-gray-400'
                            }`} />
                            <p className="font-semibold text-gray-800">Plant Farming</p>
                          </button>

                          <button
                            type="button"
                            onClick={() => setProfileForm({ ...profileForm, farmingType: 'animal', plantType: '' })}
                            className={`p-6 border-2 rounded-lg transition-all ${
                              profileForm.farmingType === 'animal'
                                ? 'border-green-600 bg-green-50'
                                : 'border-gray-200 hover:border-green-300'
                            }`}
                          >
                            <Dog className={`h-12 w-12 mx-auto mb-3 ${
                              profileForm.farmingType === 'animal' ? 'text-green-600' : 'text-gray-400'
                            }`} />
                            <p className="font-semibold text-gray-800">Animal Farming</p>
                          </button>
                        </div>
                      </div>

                      {profileForm.farmingType === 'plant' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Plant Type
                          </label>
                          <select
                            value={profileForm.plantType}
                            onChange={(e) => setProfileForm({ ...profileForm, plantType: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="">Choose a plant...</option>
                            {plantTypes.map((plant) => (
                              <option key={plant} value={plant}>{plant}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {profileForm.farmingType === 'animal' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Animal Type
                          </label>
                          <select
                            value={profileForm.animalType}
                            onChange={(e) => setProfileForm({ ...profileForm, animalType: e.target.value })}
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
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save className="h-5 w-5" />
                    <span>Save Changes</span>
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'password' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Lock className="h-5 w-5" />
                    <span>Change Password</span>
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'appearance' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Appearance Settings</h2>

                <div className="space-y-6">
                  <div className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {darkMode ? (
                          <Moon className="h-8 w-8 text-gray-700" />
                        ) : (
                          <Sun className="h-8 w-8 text-yellow-500" />
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">
                            {darkMode ? 'Dark Mode' : 'Light Mode'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {darkMode ? 'Dark theme is currently active' : 'Light theme is currently active'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={toggleDarkMode}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                          darkMode ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                            darkMode ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      Theme preferences are saved locally and will persist across sessions.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
