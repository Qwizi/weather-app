'use client';

import { Bookmark, Home } from "lucide-react";
import { TemperatureToggleButton } from "./TemperatureToggleButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRef, useEffect as useReactEffect } from "react";


export const DockPanel = () => {

    const [linkToRedirect, setLinkToRedirect] = useState("/saved");
    const pathname = usePathname();
    const favorites = useSelector((state: RootState) => state.favorites.cities);
    const favoritesCount = favorites.length;
    const [mounted, setMounted] = useState(false);
    const dockIconRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);


    const icon = pathname === "/saved" ? <Home className="dock-icon" /> : <>
        <div className="relative">
            <Bookmark className="dock-icon" ref={dockIconRef} />
            {mounted && (
                <div className="absolute -top-1 -right-1 size-4 bg-amber-500 border-2 border-background-dark rounded-full">
                    <span className="text-xs text-white font-bold flex items-center justify-center h-full w-full">{favoritesCount}</span>
                </div>
            )}
        </div>
    </>;

    useEffect(() => {
        setLinkToRedirect(pathname === "/saved" ? "/" : "/saved");
    }, [pathname]);

    return (
        <div className="dock-panel">
            <div className="dock-panel-content bg-[#192633] flex-row items-center gap-3">
                <Link href={linkToRedirect} className="dock-button" title="Ulubione miasta">
                    {icon}
                </Link>
                <div className="vertical-divider"></div>
                <TemperatureToggleButton />
            </div>
        </div>
    );
}