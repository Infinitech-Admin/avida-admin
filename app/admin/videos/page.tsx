import React from "react";
import { Viewport } from "next";
import VideoTable from "./table";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const page = () => {
  return (
    <div className="container">
      <VideoTable />
    </div>
  );
};

export default page;
