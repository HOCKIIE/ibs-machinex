import React, { useContext } from 'react';
import {AdminContext} from '@/contexts/AdminContext';
import Link from 'next/link';
import { FiBarChart2 } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { BsCardText, BsPersonVcard, BsBox, BsMailbox  } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineCategory } from "react-icons/md";
import { TbTagStarred } from "react-icons/tb";
import { TbUsers } from "react-icons/tb";
import { useAuth } from "@/contexts/AdminContext";

type menuName = "Dashboard"|"Category"|"Brand"|"Product"|"Blog"|"About"|"Contact"|"Settings"|"User";
interface IconProps { type: menuName }
const Icon : React.FC<IconProps> = ({ type }) => {
    const iconMap : Record<menuName, JSX.Element> = {
        Dashboard:<RxDashboard fontSize={20}/>,
        Category:<MdOutlineCategory fontSize={20}/>,
        Brand: <TbTagStarred fontSize={20}/>,
        Product:<BsBox fontSize={20}/>,
        Blog:<BsCardText fontSize={20}/>,
        About:<BsPersonVcard fontSize={20}/>,
        Contact:<BsMailbox fontSize={20}/>,
        Settings:<IoSettingsOutline fontSize={20}/>,
        User: <TbUsers fontSize={20}/>
    };
    return (iconMap[type])?<>{iconMap[type]}</>:<></>;
};

const menuItem: { name: menuName, path: string }[] = [
    { name:"Dashboard", path:"/admin" },
    { name:"Category", path:"/admin/category" },
    { name:"Brand", path:"/admin/brand" },
    { name:"Product", path:"/admin/product" },
    { name:"Blog", path:"/admin/blog" },
    { name:"About", path:"/admin/about" },
    { name:"Contact", path:"/admin/contact" },
    { name:"Settings", path:"/admin/settings" },
    { name:"User", path:"/admin/user" }
];

const Sidebar = () => {

    const {menuActive, setMenuActive} = useContext(AdminContext) as { menuActive: string, setMenuActive: (item: string) => void };
    const { isSidebarOpen } = useAuth();

    const handleClick =  (item:string) => {
        setMenuActive(item)
    }
    
    return (
        <aside className={`sticky top-0 h-screen sidebar left-0 bottom-0 ${!isSidebarOpen?`w-15 px-2`:`w-[290px] px-5`} flex-col overflow-y-auto border-r border-gray-200 bg-white transition-all duration-300 lg:static lg:translate-x-0 dark:border-gray-800 dark:bg-black -translate-x-full`}>
            <div className="flex items-center gap-2 pt-8 sidebar-header pb-7 justify-between">
                <Link href="/admin">
                    <div className="logo flex items-center gap-3">
                        <button title="Admin Page" className="inline-flex items-center justify-center rounded-lg bg-indigo-500 p-[5px] text-base font-medium text-white shadow-xs duration-200 hover:bg-primary-600 max-xs:w-full">
                            <FiBarChart2 fontSize={24} className="font-bold" />
                        </button>
                        {isSidebarOpen && <div className={`font-bold text-xl overflow-y-hidden text-nowrap`}>Admin Page</div>}
                    </div>
                </Link>
            </div>
            <h3 className="mb-4 text-xs leading-[20px] text-gray-400 uppercase">
                <span className="menu-group-title">
                    MENU
                </span>
            </h3>
            <ul className="flex flex-col gap-4 mb-6">
                {menuItem.map(({name,path}, k) =>
                <li key={k}>
                    <Link 
                        href={path} 
                        onClick={()=>handleClick(name)} 
                        className={`menu-item group hover:bg-slate-100 ${menuActive === name ? ` bg-indigo-100 text-indigo-600` : ``}`}
                    >
                        <Icon type={name} />
                        <span className={`menu-item-text ${!isSidebarOpen?`hidden`:``}`}>{name.replace('_', ' ')}</span>
                    </Link>
                </li>
                )}
            </ul>
        </aside>
    )
}

export default Sidebar