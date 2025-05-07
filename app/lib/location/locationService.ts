// app/lib/location/locationService.ts
import { updateUserProfile } from '../firebase/auth';

// Represents a nearby place/business
export interface NearbyPlace {
  name: string;
  type: string;
  location: {
    latitude: number;
    longitude: number;
  };
  distance: number; // in meters
}

// Mock data for nearby places
// In a real implementation, this would come from a Maps API like Google Maps or Mapbox
const mockNearbyPlaces: NearbyPlace[] = [
  {
    name: 'Central Park',
    type: 'park',
    location: { latitude: 40.7812, longitude: -73.9665 },
    distance: 800
  },
  {
    name: 'Main Street Library',
    type: 'library',
    location: { latitude: 40.7125, longitude: -74.0082 },
    distance: 1200
  },
  {
    name: 'Sunrise Cafe',
    type: 'coffee shop',
    location: { latitude: 40.7155, longitude: -74.0050 },
    distance: 300
  },
  {
    name: 'Green Grocers',
    type: 'grocery store',
    location: { latitude: 40.7140, longitude: -74.0062 },
    distance: 500
  },
  {
    name: 'Community Center',
    type: 'community center',
    location: { latitude: 40.7135, longitude: -74.0072 },
    distance: 600
  },
  {
    name: 'Washington High School',
    type: 'school',
    location: { latitude: 40.7145, longitude: -74.0090 },
    distance: 900
  },
  {
    name: 'Riverfront Park',
    type: 'park',
    location: { latitude: 40.7160, longitude: -74.0040 },
    distance: 700
  },
  {
    name: 'City Hospital',
    type: 'hospital',
    location: { latitude: 40.7170, longitude: -74.0095 },
    distance: 1500
  },
  {
    name: 'Local Pizzeria',
    type: 'restaurant',
    location: { latitude: 40.7132, longitude: -74.0058 },
    distance: 400
  },
  {
    name: 'Starbucks',
    type: 'coffee shop',
    location: { latitude: 40.7138, longitude: -74.0063 },
    distance: 250
  }
];

// Request location permissions and update user profile
export const requestLocationPermission = async (userId: string): Promise<{
  success: boolean;
  location?: { latitude: number; longitude: number };
  error?: string;
}> => {
  if (!navigator.geolocation) {
    return {
      success: false,
      error: 'Geolocation is not supported by your browser'
    };
  }

  try {
    // Request current position
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });

    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };

    // Update user profile with location
    await updateUserProfile(userId, { location });

    return {
      success: true,
      location
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to get location'
    };
  }
};

// Get nearby places based on user location
export const getNearbyPlaces = async (
  location: { latitude: number; longitude: number },
  radius: number = 2000, // meters
  limit: number = 5
): Promise<NearbyPlace[]> => {
  // In a real implementation, this would call a Maps API
  // For now, we'll simulate it using our mock data and some distance calculations
  
  // Function to calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // In a real implementation, we would call a Maps API here
  // For the mock version, we'll just filter our static data
  
  // Calculate distance for each place
  const placesWithActualDistance = mockNearbyPlaces.map(place => ({
    ...place,
    distance: calculateDistance(
      location.latitude,
      location.longitude,
      place.location.latitude,
      place.location.longitude
    )
  }));

  // Filter by radius and sort by distance
  const nearbyPlaces = placesWithActualDistance
    .filter(place => place.distance <= radius)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);

  return nearbyPlaces;
};

// Interface for real-world locations
export interface ReverseGeocodingResult {
  formattedAddress: string;
  neighborhood?: string;
  city?: string;
  county?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

// Mock reverse geocoding function
// In a real implementation, this would call a Geocoding API service
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<ReverseGeocodingResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data based on coordinates
  // In a real app, this would call Google Maps, Mapbox, or another geocoding service
  return {
    formattedAddress: `${Math.abs(latitude).toFixed(4)}° ${latitude >= 0 ? 'N' : 'S'}, ${Math.abs(longitude).toFixed(4)}° ${longitude >= 0 ? 'E' : 'W'}`,
    neighborhood: 'Sample Neighborhood',
    city: 'Sample City',
    state: 'Sample State',
    country: 'Sample Country',
    postalCode: '10000'
  };
};