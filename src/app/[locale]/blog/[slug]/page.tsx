"use client";

import React, { useState, useEffect, useRef, use } from 'react';
import { H1 } from '@/utils/Title';
import Api from '@/services/Api';
import { useLocale } from 'next-intl';
import { itemsEqual } from '@dnd-kit/sortable/dist/utilities';
import { BlogType } from '@/types/BlogType';

const BlogDetail = ({ params }:{ params: Promise<{slug:string}> }) => {
    const locale = useLocale();
    const { slug } = use(params);
    const [itemState, setData] = useState(null);
    const didFetchData = useRef(false);

    
    const fetchBlog = async () => {
        const request = await Api.get(`/blog/show/${slug}`);
        console.log(request);
        setData(request.data.data[0]);
    }
    useEffect(() => {
        document.title = "Blog Detail - IBS MachineX";
        if (!didFetchData.current) {
            didFetchData.current = true;
            fetchBlog();
        }
    }, []); 
    return (
        <div>
            <div className="container py-20 px-2 lg:px-0">
                <div className="pt-15">
                    {itemState &&
                        <>
                            <H1>{itemState?.[`title_${locale}`]}</H1>
                            <p className="text-black">Published on: {itemState?.published_at}</p>
                            {itemState && <div dangerouslySetInnerHTML={{ __html: itemState?.[`detail_${locale}`] ?? "" }} />}
                        </>
                    }
                    {/* <div className="grid grid-cols-12 gap-6 mt-10">
                        <div className="col-span-12">
                            <div className="flex justify-center">
                                <img src="/images/blog/Rectangle 5.png" title="Cloud Kitchen, the spirit that keeps the restaurant breathing when it no longer has a storefront" className="max-w-[800px]"/>
                            </div>
                        </div>
                        <div className="col-span-12">
                            <p className="text-gray-700 py-3">Nowadays, we see people who have passion and inspiration to have their own business, but in the end, they often do not continue because sometimes it may be due to some things or skills that may not be ready. If we consider our problems, we find that it is a specialized skill that may make it happen.</p>
                            <p className="text-gray-700 mt-5">Sometimes we may have an idea to make an application or website that we think people will definitely use, but we do not have the necessary knowledge to develop it ourselves or may not have any design skills at all, which makes it impossible to do this or that. That is part of the set that is good at everything that can be done. Everything that happens has routine work that sometimes does not need to be done by ourselves.</p>
                            <p className="text-gray-700 mt-5">The possible solution may be more than we think. By finding an Outsource that is directly skilled in various fields, which is often lacking, to come in and do it, which may be a guideline or find an Outsource to help with routine work that we know. Sometimes we will come back to focus on the heart of the business directly at the beginning. The operation of using Outsource is as follows:</p>
                            <div className="flex justify-center">
                                <img src="/images/blog/image.png" title="Cloud Kitchen, the spirit that keeps the restaurant breathing when it no longer has a storefront"/>    
                            </div>
                            <p className="text-gray-700 py-3">1. When to use Outsource?</p>
                            <p className="text-gray-700 py-3">Each business may have a different starting point for using Outsource services. Some businesses may use Outsource when they find that there are certain tasks that their team is not yet good at or does not have enough ability. Or some businesses may choose to use Outsource because the work to do is overwhelming and they can no longer keep up. In the first part, we can measure from the Performance or the results of the work that come out, whether it is satisfactory or not. If we are still not satisfied or find that this part is a weakness of our business, it is a sign that we should find Outsource to help.</p>
                            <p className="text-gray-700 py-3">However, if it is a part of the work that cannot be done in time, we can list all the tasks that need to be done each day and each month first, to see which parts we have, including specifying the time spent on each task, how much time is spent, and which parts take the most time. In addition to time, we must also add the importance of each task. If any task is not very important but takes a lot of time, assess that task as the task that we may need to find Outsource to use, so that we can spend more time on tasks that are important and help drive the business forward.</p>
                            <p className="text-gray-700 py-3">Therefore, this topic requires constant observation and consideration of our own business, and it usually occurs when the business is gradually growing, doing new things, and the amount of work increases accordingly. There is always a conflict with the feeling that we want to do everything ourselves because we want everything to be under our control, while on the other hand, we want the business to grow and expand together. When these feelings arise, prepare to evaluate whether we should use Outsource or not?</p>
                            <div className="flex justify-center">
                                <img src="/images/blog/image (1).png" title="Cloud Kitchen, the spirit that keeps the restaurant breathing when it no longer has a storefront"/>
                            </div>
                            <p className="text-gray-700 py-3">2. What should I use Outsource for?</p>
                            <p className="text-gray-700 py-3">Nowadays, outsourcing is almost universal. Almost every position can be replaced by an Outsource, from someone who takes care of payroll, someone who creates content, someone who does graphic design, someone who does housework, or anything else can be replaced by an Outsource. However, having so many jobs that can be replaced by an Outsource doesn't mean that we will always choose to use an Outsource instead. Because one common mistake is that people often choose to use an Outsource for jobs that they "don't want to do" even though that job may be the heart of the business.</p>
                            <p className="text-gray-700 py-3">Therefore, before choosing what to outsource, you should start by considering what your Core Value is and choosing to do it yourself as best as possible. Anything that is beyond the Core Value can be outsourced. For most small businesses, they should focus on developing products and services and responding to customer needs as much as possible. Therefore, other things such as IT Support or various accounting tasks can be replaced by an Outsource if we don't have enough knowledge and don't want a permanent employee in this area.</p>
                            <p className="text-gray-700 py-3">Or even jobs that require high-level skills, such as the position of CFO (Chief Financial Officer) who will take care of the finances of the business, but it may not be necessary to hire a permanent employee. You may also use the services of an Outsource CFO who will come to help us once or twice a month as appropriate. Before choosing an Outsource, consider what our Core Value is and choose to do it yourself as best as possible. Anything that is beyond the Core Value can be outsourced.</p>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default BlogDetail