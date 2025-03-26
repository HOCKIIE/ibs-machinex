import { RxHamburgerMenu } from "react-icons/rx";

const MenuToggle = ({ToggleSidebarHandle}:{ToggleSidebarHandle:()=>void}) => {
    return (
        <button onClick={ToggleSidebarHandle} title="Menu toggle" className="flex items-center justify-center w-10 h-10 text-gray-500 focus:text-gray-700 focus:ring-2 focus:ring-indigo-200 hover:bg-indigo-100 focus:bg-indigo-100 rounded-full">
            <RxHamburgerMenu fontSize={20}/>
        </button>
    )
}

export default MenuToggle