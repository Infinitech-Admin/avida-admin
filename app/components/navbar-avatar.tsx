import React from "react";
import useSWR from "swr";

import { getAuthHeaders } from "@/app/utility/auth";

const fetcherWithAuth = async (url: string) => {
  const headers = getAuthHeaders();
  const res = await fetch(url, {
    method: "GET",
    headers: headers,
  });
  return await res.json();
};

const NavbarAvatar = () => {
  let user_id;

  if (typeof window !== "undefined" && window.sessionStorage) {
    user_id = sessionStorage.getItem("user_id");
  } else {
    user_id = null;
  }

  const { data: userAvatar } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user_id}`,
    fetcherWithAuth,
    {
      refreshInterval: 5000,
    },
  );

  const avatar =
    `https://infinitech-api27.site/profiles/${userAvatar?.record?.profile?.image}` ||
    "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg";

  return (
    <>
      <img
        className="inline-block w-8 h-8 rounded-full"
        src={avatar}
        alt="Avatar"
      />
    </>
  );
};

export default NavbarAvatar;
