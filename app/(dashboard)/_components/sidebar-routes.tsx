"use client";

import { Layout, Compass, List, BarChart } from "lucide-react";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";

const guestRoutes = [
    {
        icon: Layout,
        label: "Дашборд",
        href: "/"
    },
    {
        icon: Compass,
        label: "Поиск",
        href: "/search"
    },
]

const teacherRoutes = [
    {
        icon: List,
        label: "Обучение",
        href: "/teacher/courses"
    },
    {
        icon: BarChart,
        label: "Аналитика",
        href: "/teacher/analytics"
    },
]

export const SidebarRoutes = () => {
    const pathname = usePathname()

    const isTeacherPage = pathname?.includes("/teacher");

    const routes = isTeacherPage ? teacherRoutes : guestRoutes;

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem 
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}