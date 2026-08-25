import React from "react";
import { Viewport } from "next";
import NewsTable from "./newstb";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const page = () => {
  return (
    <div className="container">
      <NewsTable />
    </div>
  );
};

export default page;
