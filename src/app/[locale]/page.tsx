import React from 'react';
import ContactSection from "@/components/main/section/Contact";
import AboutMeSection from "@/components/main/section/AboutMe";
import ProductSection from "@/components/main/section/Product";
import BlogSection from "@/components/main/section/Blog";

const page = () => {
  return (
    <div 
        className="relative bg-fixed bg-center bg-cover" 
        style={{ 
            backgroundImage: "url('/images/bg-2.svg')",
            backgroundRepeat:"no-repeat",
            backgroundPosition: "center top",
            backgroundSize: "100%", 
        }}
    >
        <>
            <ProductSection/>
            <BlogSection />
            <AboutMeSection />
            <ContactSection />
        </>    
    </div>
  )
}

export default page