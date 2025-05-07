// app/components/map/VolunteerMap.tsx
'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { getNearbyOpportunities, VolunteerTask } from '@/app/lib/firebase/firestore';
import { UserLevel } from '@/app/lib/firebase/auth';
import OpportunityMarker from './OpportunityMarker';
import Greenhouse from './Greenhouse';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(
  () => import('./VolunteerMap'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }
);

// Workaround for Leaflet marker icons in Next.js
// This needs to be done because Next.js server-side rendering doesn't include the Leaflet CSS
// Define icons here to avoid issues with server/client rendering
const defaultIcon = new Icon({
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Set the default icon for all markers
// @ts-ignore
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
});

// Map center update component
const MapCenterUpdater = ({ location }: { location: { latitude: number; longitude: number } }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView([location.latitude, location.longitude], 12);
    }
  }, [location, map]);

  return null;
};

interface VolunteerMapProps {
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  userLevel: UserLevel;
  userId: string;
}

const VolunteerMap: React.FC<VolunteerMapProps> = ({ userLocation, userLevel, userId }) => {
  const [opportunities, setOpportunities] = useState<VolunteerTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Default location (New York City) if user location is not available
  const defaultLocation = { latitude: 40.7128, longitude: -74.0060 };
  const location = userLocation && userLocation.latitude !== 0
    ? userLocation
    : defaultLocation;

  useEffect(() => {
    const fetchOpportunities = async () => {
      if (!userLocation || userLocation.latitude === 0) {
        setLoading(false);
        return;
      }

      try {
        const nearbyOpps = await getNearbyOpportunities(
          userLocation.latitude,
          userLocation.longitude,
          10, // 10km radius
          userLevel
        );

        setOpportunities(nearbyOpps);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, [userLocation, userLevel]);

  // Prompt user to share location if not already set
  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Here you would normally update the user's location in the database
          // For demo purposes, we'll just log it
          console.log('Location updated:', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (err) => {
          setError('Unable to retrieve your location. ' + err.message);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full w-full map-container relative">
      {error && (
        <div className="absolute top-2 left-2 right-2 z-10 bg-red-100 text-red-700 p-2 rounded-md text-sm">
          {error}
        </div>
      )}

      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={12}
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Update map center when location changes */}
        <MapCenterUpdater location={location} />

        {/* User's Greenhouse */}
        <Greenhouse
          position={[location.latitude, location.longitude]}
          userId={userId}
        />

        {/* Opportunity Markers */}
        {/* Opportunity Markers */}
        {opportunities.map((opportunity) => (
          opportunity.location?.coordinates?.latitude && opportunity.location?.coordinates?.longitude ? (
            <OpportunityMarker
              key={opportunity.id}
              task={opportunity}
              position={[opportunity.location.coordinates.latitude, opportunity.location.coordinates.longitude]}
            />
          ) : null
        ))}

        {/* Message if no opportunities found */}
        {opportunities.length === 0 && !loading && (
          <div className="absolute bottom-4 left-4 right-4 bg-white p-3 rounded-md shadow-md z-10">
            <p className="text-sm text-gray-700">
              No volunteer opportunities found nearby. Try expanding your search area or check back later.
            </p>
            {(!userLocation || userLocation.latitude === 0) && (
              <button
                onClick={requestLocationPermission}
                className="mt-2 text-sm text-green-600 font-medium hover:text-green-800"
              >
                Share your location to see nearby opportunities
              </button>
            )}
          </div>
        )}
      </MapContainer>
    </div>
  );
};

export default VolunteerMap;
