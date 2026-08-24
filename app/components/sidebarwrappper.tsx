"use client";
import { usePathname } from 'next/navigation';
import AdminSidebar from './adminsidebar';


const SidebarWrapper = () => {
    const pathname = usePathname();

    return <AdminSidebar pathname={pathname || ''} />;
};

export default SidebarWrapper;
