// app/components/map/ClientMap.tsx
'use client';

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

const ClientMap = (props) => {
  return <DynamicMap {...props} />;
};

export default ClientMap;
