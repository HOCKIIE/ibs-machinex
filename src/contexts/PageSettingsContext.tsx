"use client"
import { ReactNode, createContext, useContext, useState } from "react";

interface contextType {
    SidebarActive:boolean,
    ToggleSidebarHandle:()=>void
}
export const PageSettings = createContext<contextType>({
    SidebarActive: false,
    ToggleSidebarHandle:() => {}
})

export default function PageSettingsContext({ children }: { children: ReactNode })
{
    const [SidebarActive, SetSidebarActive] = useState<boolean>(false);
    const ToggleSidebarHandle = () => {
        SetSidebarActive(!SidebarActive)
    }
    return <PageSettings.Provider value={{SidebarActive,ToggleSidebarHandle}}>{children}</PageSettings.Provider>
}
export const useGlobal = () => useContext(PageSettings);