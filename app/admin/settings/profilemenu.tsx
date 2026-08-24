"use client"

import { useState, useMemo } from "react"
import { BiCertification } from "react-icons/bi"
import { GrGallery } from "react-icons/gr"
import { LuBell, LuUser2, LuSettings, LuUsers } from "react-icons/lu"
import Profile from "./profile"
import Certificate from "./certifications"
import Notifications from "./notifications"
import SocialProfiles from "./social"
import Gallery from "./gallery"

type TabItem = {
  id: number
  label: string
  icon: React.ReactNode
  component: React.ReactNode
}

export default function ProfileMenu() {
  const [activeTab, setActiveTab] = useState(1)

  const tabs: TabItem[] = [
    
    { id: 1, label: "Profile", icon: <LuUser2 className="w-4 h-4" />, component: <Profile /> },
    // { id: 3, label: "Social", icon: <LuUsers className="w-4 h-4" />, component: <SocialProfiles /> },
    // { id: 4, label: "Notifications", icon: <LuBell className="w-4 h-4" />, component: <Notifications /> },
    { id: 2, label: "Certificates", icon: <BiCertification className="w-4 h-4" />, component: <Certificate /> },
    { id: 3, label: "Gallery", icon: <GrGallery className="w-4 h-4" />, component: <Gallery /> },
  ]

  const activeComponent = useMemo(() => {
    return tabs.find((tab) => tab.id === activeTab)?.component || <div>Default Content</div>
  }, [activeTab])

  return (
    <div className="flex flex-col lg:flex-row w-full">
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex flex-col w-64 border-r border-gray-200 bg-white">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${activeTab === tab.id
              ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
              : "text-gray-600 hover:bg-gray-50"
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mobile tab bar */}
      <div className="lg:hidden flex w-full overflow-x-auto border-b border-gray-200 bg-white">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center justify-center px-4 py-2 text-xs font-medium whitespace-nowrap ${activeTab === tab.id ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
              }`}
            style={{ flex: "1 0 20%" }}  // 1/5th of the width
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>


      {/* Content Area */}
      <div className="flex-1 p-4 bg-gray-50">
        {activeComponent}
      </div>
    </div>
  )
}

