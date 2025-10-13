import { Sprout, Target, Users, Zap, Mail, Phone, MapPin, Handshake } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <Sprout className="h-20 w-20" />
            </div>
            <h1 className="text-5xl font-bold mb-4">About FarmBora</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Empowering smallholder farmers to adapt to climate challenges through intelligent digital tools
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-12"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Target className="h-8 w-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            FarmBora is dedicated to helping smallholder farmers predict and adapt to drought, floods, and pest outbreaks through cutting-edge technology. We combine artificial intelligence, IoT sensors, and real-time weather data to provide actionable insights that improve agricultural productivity and sustainability across Kenya and beyond.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow"
          >
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Technology</h3>
            <p className="text-gray-600">
              AI-powered predictions and IoT sensors provide real-time data on environmental conditions critical to farming success.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow"
          >
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Community Focus</h3>
            <p className="text-gray-600">
              Built for farmers, by people who understand agriculture. Our marketplace connects farmers directly with buyers and agrovets.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow"
          >
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Climate Resilience</h3>
            <p className="text-gray-600">
              Help farmers adapt to changing climate patterns with predictive analytics and tailored recommendations.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How FarmBora Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Environmental Monitoring</h3>
                  <p className="text-gray-700">
                    IoT sensors continuously monitor temperature, humidity, soil pH, and moisture levels on your farm.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Weather Predictions</h3>
                  <p className="text-gray-700">
                    Advanced AI analyzes regional weather patterns to predict rainfall, temperature, and potential climate events.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Smart Recommendations</h3>
                  <p className="text-gray-700">
                    Receive personalized farming advice based on your crop type, growth stage, and current conditions.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Digital Marketplace</h3>
                  <p className="text-gray-700">
                    Connect directly with buyers and agrovets to sell your products and access farming supplies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-12"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Handshake className="h-8 w-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">Partner With Us</h2>
          </div>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            We're always looking to collaborate with organizations that share our vision of sustainable agriculture. Whether you're an NGO, government agency, research institution, or agricultural technology provider, we'd love to explore partnership opportunities.
          </p>
          <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Explore Partnership Opportunities
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-lg shadow-lg p-8"
        >
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="text-green-100 mb-8 text-lg">
            Have questions or need support? We're here to help you succeed.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold mb-1">Email</p>
                <a href="mailto:contact@farmbora.com" className="text-green-100 hover:text-white">
                  contact@farmbora.com
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold mb-1">Phone</p>
                <a href="tel:+254712345678" className="text-green-100 hover:text-white">
                  +254 712 345 678
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold mb-1">Location</p>
                <p className="text-green-100">Nairobi, Kenya</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
