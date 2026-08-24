'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import PropertyDetailsContent from './propertycontent';
import PropertyUnits from './units';
import PropertyBuilding from './building';
import MasterPlan from './plan';
import Features from './features';
import { Tabs, Tab, Card, CardBody } from '@heroui/react';
import { LuBuilding2 } from 'react-icons/lu';
import { MdOutlineMapsHomeWork, MdOutlineMeetingRoom } from 'react-icons/md';
import { RiBuilding2Line } from 'react-icons/ri';
import { BsBuildingCheck } from 'react-icons/bs';

const PropertyDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const tabItems = [
    {
      key: 'property',
      title: (
        <div className="flex items-center gap-2">
          <LuBuilding2 />
          Property
        </div>
      ),
      content: <PropertyDetailsContent id={id} />,
    },
    
    {
      key: 'masterplan',
      title: (
        <div className="flex items-center gap-2">
          <MdOutlineMapsHomeWork />
          Master Plan
        </div>
      ),
      content: <MasterPlan id={id} />,
    },

    {
      key: 'building',
      title: (
        <div className="flex items-center gap-2">
          <RiBuilding2Line />
          Building
        </div>
      ),
      content: <PropertyBuilding id={id} />,
    },
   
    {
      key: 'features',
      title: (
        <div className="flex items-center gap-2">
          <BsBuildingCheck />
          Features
        </div>
      ),
      content: <Features id={id} />,
    },
  ];

  return (
    <div className="flex flex-col">
      <Card>
        <CardBody>
          <Tabs aria-label="Property Details Tabs">
            {tabItems.map((item) => (
              <Tab key={item.key} title={item.title}>
                <div className="p-4">{item.content}</div>
              </Tab>
            ))}
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default function PropertyDetailsWrapper() {
  return (
    <Suspense fallback={<div>Loading sections...</div>}>
      <PropertyDetails />
    </Suspense>
  );
}
