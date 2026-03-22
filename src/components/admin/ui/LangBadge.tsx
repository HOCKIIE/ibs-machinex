export const LangBadge = ({lang}:{lang:string}) => {
    let className = 'bg-emerald-200 text-emerald-600';
        if(lang === 'EN') className = `bg-blue-200 text-indigo-600`;
        if(lang === 'JA') className = `bg-pink-200 text-pink-600`;
        
        return <div className={`${className} rounded-md text-xs flex items-center px-1 ms-1`}>{lang}</div>
}