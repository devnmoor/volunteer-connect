// app/components/map/MapComponent.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon issues
useEffect(() => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
    iconRetinaUrl: icon.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
  });
}, []);

const MapComponent = ({ initialCenter, markers, onMarkerClick }) => {
  return (
    <MapContainer
      center={initialCenter || [51.505, -0.09]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers && markers.map((marker, index) => (
        <Marker 
          key={index} 
          position={[marker.latitude, marker.longitude]}
          eventHandlers={{
            click: () => onMarkerClick && onMarkerClick(marker),
          }}
        >
          <Popup>
            {marker.title}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
