"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import EditForm from "./editform";

type Props = {
  id: string;
};

const Editproperties = ({ id }: Props) => {
  const accessToken =
    typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "multipart/form-data",
  };

  const [property, setProperty] = useState<any | null>(null);

  const [properties, setProperties] = useState<any[] | null>([]);

  useEffect(() => {
    const getProperty = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/property/${id}`,
        { headers }
      );

      setProperty(response.data.record);
    };

    const getProperties = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/properties`,
        { headers }
      );

      setProperties(response.data.records);
    };

    getProperty();
    getProperties();
  }, []);

  return (
    <>
      {property && properties && (
        <EditForm property={property} properties={properties} />
      )}
    </>
  );
};

export default Editproperties;
