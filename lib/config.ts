// Configuration for the application
export const config = {
  // API Configuration
  apiUrl:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://whatsapp-worker.elrazand.workers.dev",

  // Google Maps Configuration
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",

  // Frontend URL
  frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
};
