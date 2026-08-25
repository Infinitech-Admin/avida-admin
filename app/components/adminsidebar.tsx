"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LuLayoutDashboard,
  LuBuilding2,
  LuCalendarCheck,
  LuNetwork,
  LuFileQuestion,
  LuNewspaper,
  LuSettings,
  LuLogOut,
  LuDownload,
  LuStar,
  LuVideo,
  LuPenLine,
  LuMailQuestion,
  LuCloud,
} from "react-icons/lu";
import { FiMenu } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import useSWR from "swr";
import { getAuthHeaders } from "@/app/utility/auth";
import { destroyCookie } from "nookies";

interface AdminSidebarProps {
  pathname: string;
}

const LOGO_SRC = "/avida-logo.png";

const fetcherWithAuth = async (url: string) => {
  const headers = getAuthHeaders();
  const res = await fetch(url, { method: "GET", headers });
  return await res.json();
};

function formatGB(bytes: number) {
  return (bytes / 1024 ** 3).toFixed(1);
}

const StorageWidget: React.FC = () => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/storage-usage`,
    fetcherWithAuth,
    { refreshInterval: 5 * 60 * 1000 }, // refresh every 5 min, no need for real-time here
  );

  if (error || !data) return null;

  const percent = data.percent_used;
  const usedGB = formatGB(data.used_bytes);
  const totalGB = formatGB(data.total_bytes);
  const barColor =
    percent > 90
      ? "bg-red-500"
      : percent > 75
        ? "bg-yellow-500"
        : "bg-blue-600";

  return (
    <div className="mx-2 mb-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1.5">
        <LuCloud className="h-4 w-4 shrink-0" />
        <span>Storage ({percent}% full)</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">
        {usedGB} GB of {totalGB} GB used
      </p>
    </div>
  );
};

const AdminSidebar: React.FC<AdminSidebarProps> = ({ pathname }) => {
  const [loadingPath, setLoadingPath] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (url: string) => {
    setLoadingPath(url);
    setSidebarOpen(false);
    router.push(url);
  };

  useEffect(() => {
    if (loadingPath === pathname) {
      setLoadingPath(null);
    }
  }, [pathname, loadingPath]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LuLayoutDashboard className="h-5 w-5 shrink-0" />,
    },
    {
      name: "Properties",
      path: "/admin/properties",
      icon: <LuBuilding2 className="h-5 w-5 shrink-0" />,
    },
    {
      name: "Schedules",
      path: "/admin/schedules",
      icon: <LuCalendarCheck className="h-5 w-5 shrink-0" />,
    },
    {
      name: "Applications",
      path: "/admin/applications",
      icon: <LuNetwork className="h-5 w-5 shrink-0" />,
    },
    {
      name: "FAQs",
      path: "/admin/faqs",
      icon: <LuFileQuestion className="h-5 w-5 shrink-0" />,
    },
    {
      name: "News & Updates",
      path: "/admin/news",
      icon: <LuNewspaper className="h-5 w-5 shrink-0" />,
    },
    {
      name: "Testimonials",
      path: "/admin/testimonials",
      icon: <LuStar className="h-5 w-5 shrink-0" />,
    },
    {
      name: "Videos",
      path: "/admin/videos",
      icon: <LuVideo className="h-5 w-5 shrink-0" />,
    },
    {
      name: "Contracts",
      path: "/admin/contracts",
      icon: <LuPenLine className="h-5 w-5 shrink-0" />,
    },
    {
      name: "Inquiries",
      path: "/admin/inquiries",
      icon: <LuMailQuestion className="h-5 w-5 shrink-0" />,
    },
    // {
    //   name: "Download",
    //   path: "/admin/download",
    //   icon: <LuDownload className="h-5 w-5 shrink-0" />,
    // },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <LuSettings className="h-5 w-5 shrink-0" />,
    },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("profile_id");
    sessionStorage.removeItem("user_id");
    destroyCookie(null, "token");
    window.location.href = "/auth/login";
  };

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex h-20 items-center justify-between bg-white shadow-sm px-4">
        <Image
          src={LOGO_SRC}
          alt="AVIDA LOGO"
          width={152}
          height={126}
          priority
          className="object-contain h-14 w-auto"
        />
        <button
          className="p-2 text-2xl rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {isSidebarOpen ? <AiOutlineClose /> : <FiMenu />}
        </button>
      </div>

      <aside
        className={`fixed lg:sticky top-0 left-0 h-full lg:h-screen w-72 sm:w-80 lg:w-64 xl:w-72 shrink-0 bg-white shadow-sm flex flex-col transition-transform duration-300 z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-4 hidden lg:flex justify-center">
          <Image
            src={LOGO_SRC}
            alt="AVIDA LOGO"
            width={152}
            height={126}
            priority
            className="object-contain h-24 w-auto"
          />
        </div>

        <div className="flex lg:hidden items-center justify-between p-4 border-b">
          <Image
            src={LOGO_SRC}
            alt="AVIDA LOGO"
            width={152}
            height={126}
            className="object-contain h-14 w-auto"
          />
          <button
            className="p-2 text-xl rounded-md hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
          >
            <AiOutlineClose />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="menu p-0 flex-grow space-y-1 sm:space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center w-full gap-2 p-2 rounded text-sm sm:text-[15px] transition-colors ${
                    pathname === item.path
                      ? "bg-blue-700 text-white"
                      : "hover:bg-blue-700 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span className="truncate">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Storage widget + logout pinned at the bottom */}
        <div className="border-t pt-3">
          <StorageWidget />
          <ul className="px-4 pb-4">
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center w-full gap-2 p-2 rounded text-sm sm:text-[15px] hover:bg-blue-700 hover:text-white"
              >
                <LuLogOut className="h-5 w-5 shrink-0" />
                <span>Log out</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
