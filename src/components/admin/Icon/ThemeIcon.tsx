"use client"
import React from 'react'
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { RiComputerLine } from "react-icons/ri";
import { ThemeIconType } from '@/types/ThemeIcon';

interface IconProps { theme:ThemeIconType };
const Icon: React.FC<IconProps> = ({ theme }) => 
{
    const iconMap: Record<ThemeIconType, JSX.Element> = {
        dark: <><MdOutlineDarkMode fontSize={24} /></>,
        light: <><MdOutlineLightMode fontSize={24} /></>,
        system: <><RiComputerLine fontSize={24} /></>
    };
    return (iconMap[theme])?<>{iconMap[theme]}</>:<></>;
};
export const ThemeIcon = ({theme}: IconProps) => <Icon theme={theme}/>