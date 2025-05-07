// app/components/map/OpportunityMarker.tsx
'use client';

import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { VolunteerTask } from '@/app/lib/firebase/firestore';

interface OpportunityMarkerProps {
  task: VolunteerTask;
  position: [number, number]; // [latitude, longitude]
}

const OpportunityMarker: React.FC<OpportunityMarkerProps> = ({ task, position }) => {
  // Create category-specific icons
  const getCategoryIcon = (category: string) => {
    let color;
    switch (category) {
      case 'communityService':
        color = 'purple';
        break;
      case 'environmentalAction':
        color = 'green';
        break;
      case 'educationYouthSupport':
        color = 'yellow';
        break;
      case 'healthWellness':
        color = 'blue';
        break;
      default:
        color = 'gray';
    }
    
    return new Icon({
      iconUrl: `/images/markers/${color}-marker.png`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });
  };
  
  // Format category for display
  const formatCategory = (category: string) => {
    switch (category) {
      case 'communityService':
        return 'Community Service';
      case 'environmentalAction':
        return 'Environmental Action';
      case 'educationYouthSupport':
        return 'Education & Youth';
      case 'healthWellness':
        return 'Health & Wellness';
      default:
        return category;
    }
  };
  
  return (
    <Marker 
      position={position} 
      icon={getCategoryIcon(task.category)}
    >
      <Popup>
        <div className="max-w-sm">
          <h3 className="font-semibold text-md">{task.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          
          <div className="mt-2 flex flex-wrap gap-1">
            <span className={`text-xs px-2 py-1 rounded-full 
              ${task.category === 'communityService' ? 'bg-purple-100 text-purple-800' : 
                task.category === 'environmentalAction' ? 'bg-green-100 text-green-800' : 
                task.category === 'educationYouthSupport' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-blue-100 text-blue-800'}`}
            >
              {formatCategory(task.category)}
            </span>
            
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
              {task.estimatedTime} min
            </span>
            
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
              {task.locationType === 'remote' ? 'Do from home' : 
                task.locationType === 'inPerson' ? 'In-person' : 'Virtual meeting'}
            </span>
          </div>
          
          <div className="mt-3 pt-2 border-t border-gray-200">
            <button className="w-full text-sm py-1 bg-green-600 hover:bg-green-700 text-white rounded-md">
              View Details
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default OpportunityMarker;
