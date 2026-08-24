"use client";

import Warning from '@/app/components/alert/warning';
import useSWR from 'swr';
import { getAuthHeaders } from '@/app/utility/auth';
import { Card, CardBody } from '@heroui/react';
import { LuBriefcase, LuBuilding2, LuCalendarRange, LuMailQuestion } from 'react-icons/lu';
import DashboardInquiryTable from './inquiries';
import DashboardAppointmentTable from './appointment';

const fetcherWithAuth = async (url: string) => {
  const headers = getAuthHeaders();
  const res = await fetch(url, {
    method: 'GET',
    headers: headers,
  });
  return await res.json();
};

const DashboardPage: React.FC = () => {
  const { data, error, } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/get-counts`,
    fetcherWithAuth
  );

  if (error) {
    return <Warning message="Failed to load data." />;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const dashboardCard = [
    {
      key: "properties",
      name: "total Properties",
      data: data.records.properties,
      icons: <LuBuilding2 size={56} />,
      bgcolor: "bg-green-200",
      textcolor: "text-green-700",
    },

    {
      key: "inquiries",
      name: "total inquiries",
      data: data.records.inquiries,
      icons: <LuMailQuestion size={56} />,
      bgcolor: "bg-blue-200",
      textcolor: "text-blue-700",
    },

    {
      key: "appoitnment",
      name: "total appointments",
      data: data.records.viewings,
      icons: <LuCalendarRange size={56} />,
      bgcolor: "bg-yellow-100",
      textcolor: "text-yellow-700",
    },

    {
      key: "application",
      name: "total applications",
      data: data.records.applications,
      icons: <LuBriefcase size={56} />,
      bgcolor: "bg-pink-200",
      textcolor: "text-pink-700",
    },
  ];

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4'>
        {dashboardCard.map((item) => (
          <Card key={item.key} className={`shadow-none rounded-xl border-gray-300 py-4 px-2 ${item.bgcolor}`}>
            <CardBody>
              <div className='flex justify-between items-center'>
                <div>
                  <h1 className={`${item.textcolor} text-4xl font-semibold`}>{item.data}</h1>
                  <h1 className={`${item.textcolor} font-medium uppercase`}>{item.name}</h1>
                </div>
                <div className={`${item.textcolor}`}>
                  {item.icons}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
        <div>
          <DashboardInquiryTable />
        </div>
        <div>
          <DashboardAppointmentTable />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
