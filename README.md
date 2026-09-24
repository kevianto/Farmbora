# FarmBora - Smart IoT & AI Farming Platform

Welcome to the FarmBora exhibition demo! This project has been upgraded from a basic frontend prototype to a full-stack, real-time command center.

## 🚀 Features

- **Real-Time IoT Simulation:** The backend generates live sensor data (temperature, humidity, soil moisture, pH) with realistic fluctuations. The frontend dashboard polls this data every 5 seconds.
- **AI Rules Engine:** The backend continuously monitors incoming telemetry against environmental thresholds to automatically trigger critical agronomic alerts (e.g., Drought Risk, Pest Outbreak).
- **Live Weather Integration:** The backend fetches real-time meteorological data and forecasts via the Open-Meteo API based on the farm's GPS coordinates.
- **Farm Registration (Geolocation):** Captures browser geolocation to pinpoint the farm's coordinates upon registration.
- **Premium UI/UX:** A high-fidelity, polished, SaaS-style interface using Tailwind CSS and Framer Motion, optimized for investor and hackathon demonstrations.
- **Zero-Config Backend:** Utilizes an in-memory data store. No MongoDB setup required to get the demo running instantly.

## 🛠️ How to Run the Demo Locally

You will need two terminal windows open—one for the backend and one for the frontend.

### 1. Start the Backend

Open a terminal, navigate to the `backend` directory, and start the server:

```bash
cd backend
npm install  # (If you haven't already installed dependencies)
npm start
```

The backend server will spin up on `http://localhost:5000`.

### 2. Start the Frontend

Open a new terminal window, navigate to the root directory (`Farmbora`), and start the Vite development server:

```bash
npm install  # (If you haven't already installed dependencies)
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port Vite provides).

## 🎮 Demo Walkthrough Guide

To show off the platform's capabilities during an exhibition:

1. **The Landing Page:** Start at the root URL `/`. Show the premium hero section and platform features.
2. **Registration:** Click "Get Started" to create an account. Fill out the details.
3. **Farm Setup (Profile Page):** Allow the browser to access your location. This simulates the farm's GPS coordinates locking in. Enter a farm name and select a crop type.
4. **The Command Center (Dashboard):** 
   - Point out the **Live Telemetry** updating every 5 seconds.
   - Show the **Local Weather** fetched dynamically based on the location.
   - Check the **Demo Mode** toggle to explain how data is being simulated for the exhibition.
   - Wait for the **AI Intelligence** panel to trigger an alert. The simulation randomly spikes parameters to trigger "Drought" or "Pest" warnings in real-time.
5. **AI Assistant Chatbot:** Open the floating chatbot in the bottom right to showcase the "FarmBora AI" interface.
6. **Marketplace:** Navigate to the Market to show off the polished e-commerce feel and "List Product" capabilities.

---
*Built for the future of agriculture.*