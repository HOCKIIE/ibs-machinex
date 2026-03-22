export const Switch = ({
    id,
    checked,
    handlerChangeStatus
}:{
    id: number
    checked: boolean
    handlerChangeStatus: (id:number, checked:boolean) => void
}) => {
    return <label className="inline-flex items-center me-5 cursor-pointer">
            <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={checked} 
                onChange={(e)=>{
                    const checked = e.target.checked;
                    handlerChangeStatus(id, checked)
                }}
            />
            <div className="relative w-9 h-5 bg-neutral-quaternary rounded-full peer bg-slate-200 dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-600">
                <div className="absolute h-full flex items-center left-[6px]">
                    <div className='h-2 border-r peer-checked:border-white w-1'></div>
                </div>
            </div>
        </label>
}