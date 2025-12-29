'use client';

import { Bookmark, Home } from "lucide-react";
import { TemperatureToggleButton } from "../../TemperatureToggleButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const DockPanel = () => {
    const [linkToRedirect, setLinkToRedirect] = useState("/saved");
    const pathname = usePathname();
    const icon = pathname === "/saved" ? <Home className="dock-icon"/> : <Bookmark className="dock-icon"/>;

    useEffect(() => {
        setLinkToRedirect(pathname === "/saved" ? "/" : "/saved");
    }, [pathname]);

    return (
        <div className="dock-panel">
            <div className="dock-panel-content bg-[#192633]">
                <Link href={linkToRedirect} className="dock-button" title="Ulubione miasta">
                    {icon}
                </Link> 
                <div className="vertical-divider"></div>
                <TemperatureToggleButton />
            </div>
        </div>
    )
};