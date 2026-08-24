import React from "react";
import EditProperties from "./editproperties";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;



  return <EditProperties id={id} />;
};

export default Page;
