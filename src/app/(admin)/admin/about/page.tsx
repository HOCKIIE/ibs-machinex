"use client"
import React,{ useRef, useState, useEffect } from 'react';
import "../custom.scss";
import Api from '@/services/Api';
import { inter } from "@/fonts/fonts";
import { useForm  } from "react-hook-form";
import { EditButton, CancelButton, SaveButton } from '@/components/main/button/Buttons';
import DefaultLayout from '@/components/admin/layout/DefaultLayout';
import Breadcrumb from '@/components/admin/Breadcrumb/Breadcrumb';
import { ContactType } from '@/types/ContactType';
import { AboutType } from '@/types/AboutType';
import { useContactStore } from '@/store/useContactStore';

const About = () => 
{
    const editableRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isEditAbout, setEditAbout] = useState<boolean>(false);
    const [isEditContact, setEditContact] = useState<boolean>(false);
    const [setfont, setFontState] = useState<boolean>(true);

    const [aboutData, setAboutData] = useState<AboutType>();
    const [contactData, setContactData] = useState<ContactType>();

    const {
        register,
        reset
    } = useForm({
        defaultValues: {
            title: contactData?.title || "",
            address: contactData?.address || "",
            phone: contactData?.phone || "",
            mobile: contactData?.mobile || "",
            email: contactData?.email || "",
            gmap: contactData?.gmap || ""
        },
    });

    const { fetchContact, contact } = useContactStore();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => 
    {
        const { name, value } = event.target;
        setContactData((prevState) => ({
            ...prevState, [name]: value
        }));
        
    };

    const EditAbout = () => {
        setEditAbout(!isEditAbout);
    }
    const EditContact = () => {
        setEditContact(!isEditContact);
    }
    const toggle = () => {
        setFontState(!setfont);
    }
    const saveChange = () => {
    }



    const CalcelEdit = () => {
        reset({
            address:contact?.address,
            phone:contact?.phone,
            mobile:contact?.mobile,
            gmap:contact?.gmap
        });
        EditContact()
    }

    useEffect(()=>{
        const fetchData = async () => {
            await fetchContact();
        };
        fetchData();
    }, [fetchContact]);
    useEffect(() => {
        if (contactData) {
            setContactData({
              id: String(contactData?.id),
              title: contactData?.title,
              address: contactData?.address,
              phone: contactData?.phone,
              mobile: contactData?.mobile,
              email: contactData?.email,
              gmap: contactData?.gmap,
              created_at: contactData?.created_at || "",
              updated_at: contactData?.updated_at || "",
            });
        }
        }, [contactData]);
  return (
    <DefaultLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="control-button mb-3">
                <div className="flex justify-between">
                    <div><Breadcrumb /></div>                    
                </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12">
                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                        <div className="px-5 py-4 sm:px-6 sm:py-5">
                            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">About Data</h3>
                        </div>
                        <div className="space-y-6 border-t border-gray-100 p-5 sm:p-6 dark:border-gray-800">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Detail :</label>
                                    <button 
                                        onClick={toggle}
                                        className={`px-2 focus:ring-2 ${setfont?`border-indigo-300 bg-indigo-200 border text-indigo-500 focus:ring-gray-500/20`:`bg-gray-200 border border-gray-300 text-gray-500 focus:ring-indigo-500/20`} rounded-lg text-[12px]`} 
                                        defaultValue="inter">Inter Font
                                    </button>
                                </div>
                                <div 
                                    ref={editableRef}
                                    contentEditable={isEditAbout}
                                    suppressContentEditableWarning={true}
                                    onInput={(e) => {console.log(e.currentTarget.textContent)}}
                                    className={`p-3 min-h-[300px] border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-300 focus:outline-none ${setfont && inter.className}`}
                                >
                                    <div className="grid grid-cols-12 gap-10">
                                        <div className="col-span-12 xl:mb-5 object">
                                            <div className="text-black font-bold text-xl xl:text-[36px]">IBS Machinex (Thailand) Company Limited</div>
                                        </div>
                                        <div className="col-span-12 md:col-span-6 object">
                                            <div className="p-5 border rounded-2xl bg-white/60">
                                                <p className="text-gray-700 font-light">IBS Machinex (thailand) Co.,Ltd. imports and distributes industrial machinery, tools. and equipment, providing complete solution from product to warehouse management. We specialize in packaging equipment and shelving systems, sourcing high-quality products from top manufacturers. Out expert team offers consultation, technical support, and efficient product sourcing to meet driverse industry needs.</p>
                                            </div>
                                            <div className="p-5 border rounded-2xl bg-white/60 mt-5 shadow-1 xl:mt-10">
                                                <h5 className="py-1 px-2 bg-blue-800 text-white rounded-md mb-2">Information</h5>
                                                <div className="text-gray-700 text-sm">
                                                    <div className="grid grid-cols-12 gap-4 space-y-3">
                                                        <div className="col-span-5">
                                                            <span className="font-semibold">Company name: </span>
                                                        </div>
                                                        <div className="col-span-7">IBS Machinex (Thailand) Co.,Ltd.</div>
                                                    </div>
                                                    <div className="grid grid-cols-12 gap-4 space-y-3">
                                                        <div className="col-span-5">
                                                            <span className="font-semibold">Address:</span>
                                                            </div><div className="col-span-7">
                                                                <p>116/102 4th Floor, Na Ranong Road, Klongtoey, Klongtoey Bangkok 10110 Thailand.</p>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-12 gap-4 space-y-3">
                                                            <div className="col-span-5">
                                                                <span className="font-semibold">Capital:</span>
                                                            </div>
                                                            <div className="col-span-7">
                                                                <p>5,000,000 THB</p>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-12 gap-4 space-y-3">
                                                            <div className="col-span-5">
                                                                <span className="font-semibold">Number of persons:</span>
                                                            </div>
                                                        <div className="col-span-7">
                                                            <p>16 persons</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-12 gap-4 space-y-3">
                                                        <div className="col-span-5">
                                                            <span className="font-semibold">Set up:</span>
                                                        </div>
                                                        <div className="col-span-7">
                                                            <p>May, 2012</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-12 gap-4 space-y-3">
                                                        <div className="col-span-5">
                                                            <span className="font-semibold">About company:</span>
                                                        </div>
                                                        <div className="col-span-7">
                                                            <p>Sell machine tools and flow control equipment.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-12 md:col-span-6 relative object">
                                            <div className="absolute top-0 left-0 bg-blue-800 rounded-2xl p-5 text-white">
                                                <div className="flex gap-3 font-bold text-4xl">
                                                    <div>10</div><div>Years</div>
                                                </div>
                                                <p className="text-2xl font-bold text-center">Experience</p>
                                            </div>
                                            <div className="absolute top-0 right-[20%] w-[119px] h-[116px] rounded-2xl overflow-hidden">
                                                <img src="/images/about/image (1).png" alt="experience" className="h-[120%] object-cover" />
                                            </div>
                                            <div className="absolute top-[40%] left-5">
                                                <div className=" w-[119px] h-[116px] rounded-2xl overflow-hidden">
                                                    <img src="/images/about/image.png" alt="experience" className="w-full h-full object-cover !important" />
                                                </div>
                                            </div>
                                            <div className="absolute top-[25%] right-[28%]">
                                                <div className="w-[334px] h-[328px] rounded-2xl overflow-hidden">
                                                    <img src="/images/about/image (3).png" alt="experience" className="w-full h-full object-cover !important"/>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-0 right-[10%] border-[7px] border-white rounded-2xl overflow-hidden">
                                                <div className="w-[197px] h-[193px]">
                                                    <img src="/images/about/image (2).png" alt="experience" className="w-full h-full object-cover !important" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-12 gap-5 mt-10">
                                        <div className="col-span-6 md:col-span-4 xl:col-span-3 object">
                                            <div className="p-5 border rounded-2xl bg-white/60">
                                                <div>
                                                    <img 
                                                        alt="Material Support" 
                                                        loading="lazy" 
                                                        width="69" 
                                                        height="69" 
                                                        decoding="async" 
                                                        data-nimg="1" 
                                                        style={{color:"transparent"}}
                                                        src="/_next/image?url=%2Fimages%2Fabout%2Fgame-icons_materials-science.png&amp;w=256&amp;q=75" 
                                                    />
                                                </div>
                                                <div className="text-blue-800 font-semibold text-xl mt-6 mb-3">Material Support</div>
                                                <div className="text-gray-700">
                                                    <p className="text-sm mt-2">Providing essential resource, tools, and assistance to ensure smooth operations and efficiency.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-6 md:col-span-4 xl:col-span-3 object">
                                            <div className="p-5 border rounded-2xl bg-white/60">
                                                <div>
                                                    <img 
                                                        alt="Production Support" 
                                                        loading="lazy" 
                                                        width="69" 
                                                        height="69" 
                                                        decoding="async" 
                                                        data-nimg="1" 
                                                        style={{color:"transparent"}}
                                                        src="/_next/image?url=%2Fimages%2Fabout%2Fgame-icons_materials-science%20(2).png&amp;w=256&amp;q=75" />
                                                </div>
                                                <div className="text-blue-800 font-semibold text-xl mt-6 mb-3">Production Support</div>
                                                <div className="text-gray-700">
                                                    <p className="text-sm mt-2">Providing essential resource, tools, and assistance to ensure smooth operations and efficiency.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-6 md:col-span-4 xl:col-span-3 object">
                                            <div className="p-5 border rounded-2xl bg-white/60">
                                                <div>
                                                    <img 
                                                        alt="Warehouse &amp; Stock Support" 
                                                        loading="lazy" 
                                                        width="69" 
                                                        height="69" 
                                                        decoding="async" 
                                                        data-nimg="1" 
                                                        style={{color:"transparent"}}
                                                        src="/_next/image?url=%2Fimages%2Fabout%2FGroup%2048.png&amp;w=256&amp;q=75" />
                                                </div>
                                                <div className="text-blue-800 font-semibold text-xl mt-6 mb-3">Warehouse &amp; Stock Support</div>
                                                <div className="text-gray-700">
                                                    <p className="text-sm mt-2">Providing essential resource, tools, and assistance to ensure smooth operations and efficiency.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-6 md:col-span-4 xl:col-span-3 object">
                                            <div className="p-5 border rounded-2xl bg-white/60">
                                                <div>
                                                    <img 
                                                        alt="Sale &amp; Marketing Support" 
                                                        loading="lazy" 
                                                        width="69" 
                                                        height="69" 
                                                        decoding="async" 
                                                        data-nimg="1" 
                                                        style={{color:"transparent"}} 
                                                        src="/_next/image?url=%2Fimages%2Fabout%2Fgame-icons_materials-science%20(1).png&amp;w=256&amp;q=75" 
                                                    />
                                                </div>
                                                <div className="text-blue-800 font-semibold text-xl mt-6 mb-3">Sale &amp; Marketing Support</div>
                                                <div className="text-gray-700">
                                                    <p className="text-sm mt-2">Providing essential resource, tools, and assistance to ensure smooth operations and efficiency.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                        <div className="flex justify-center gap-3 p-5">
                            {!isEditAbout && <EditButton setEdit={EditAbout} />}
                            {isEditAbout && <><CancelButton setEdit={EditAbout} /><SaveButton saveChange={saveChange} /></>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 mt-6">
                <div>
                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                        <div className="px-5 py-4 sm:px-6 sm:py-5">
                            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Contact Data</h3>
                        </div>
                        <div>
                            <div className="space-y-6 border-t border-gray-100 p-5 sm:p-6 dark:border-gray-800">
                                <div className="grid grid-cols-12 gap-5">
                                <div className="col-span-12 space-y-3">
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Company Name</label>
                                            <input 
                                                {...register('title',{required:true})}
                                                type="text" 
                                                className="dark:bg-dark-900 shadow-theme-xs focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 disabled:bg-gray-50 disabled:border-gray-100" 
                                                placeholder="Company Name"
                                                disabled={!isEditContact}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-12 md:col-span-6">
                                        <div className="text-black font-bold text-xl xl:text-[36px]">
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Address</label>
                                            <textarea 
                                                {...register('address',{required:true})}
                                                rows={5}
                                                placeholder="Enter a description..."
                                                className="dark:bg-dark-900 shadow-theme-xs focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-700 font-normal placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 disabled:bg-gray-50 disabled:border-gray-100"
                                                disabled={!isEditContact}
                                            ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-12 md:col-span-6 space-y-3">
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Telephone</label>
                                            <input 
                                                {...register('phone',{required:true})}
                                                type="text" 
                                                className="dark:bg-dark-900 shadow-theme-xs focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 disabled:bg-gray-50 disabled:border-gray-100" 
                                                placeholder="Telephone" 
                                                disabled={!isEditContact}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Mobile</label>
                                            <input 
                                                {...register('mobile')}
                                                type="text"
                                                className="dark:bg-dark-900 shadow-theme-xs focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 disabled:bg-gray-50 disabled:border-gray-100" 
                                                placeholder="Telephone"
                                                disabled={!isEditContact}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-12">
                                        <div className="text-black font-bold text-xl xl:text-[36px]">
                                            <div>
                                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Google Map</label>
                                                <textarea 
                                                    {...register('gmap')}
                                                    rows={3}
                                                    placeholder="Enter a description..."
                                                    className="dark:bg-dark-900 shadow-theme-xs focus:border-indigo-300 focus:ring-indigo-500/10 dark:focus:border-indigo-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-700 font-normal placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 disabled:bg-gray-50 disabled:border-gray-100"
                                                    disabled={!isEditContact}
                                                ></textarea>
                                            </div>
                                            <iframe 
                                                ref={iframeRef} 
                                                className="w-full mt-3 rounded-xl overflow-hidden"
                                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.0617695789147!2d100.55523204113399!3d13.714708698203433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29fd4c61f02af%3A0xe0d19e4fc5356b1e!2sSSP%20Tower%202!5e0!3m2!1sth!2sth!4v1742971953317!5m2!1sth!2sth" 
                                                height="280" 
                                                loading="lazy" 
                                                referrerPolicy="no-referrer-when-downgrade"
                                            ></iframe>
                                        </div>
                                    </div>
                                    <div className="col-span-12">
                                        <div className="flex justify-center gap-3">
                                            {   !isEditContact 
                                                ? <EditButton setEdit={EditContact}/>
                                                : (<><CancelButton setEdit={CalcelEdit}/> <SaveButton saveChange={saveChange} /></>)
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </DefaultLayout>
  )
}

export default About