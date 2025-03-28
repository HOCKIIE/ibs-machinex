import ContactSection from "@/components/main/section/Contact";
import AboutMeSection from "@/components/main/section/AboutMe";

export default function Home() {
    return (
        <div 
            className="relative bg-fixed bg-center bg-cover" 
            style={{ 
                backgroundImage: "url('/images/bg-banner-section1 1.png')",
                backgroundRepeat:"no-repeat",
                backgroundPosition: "center top",
                backgroundSize: "100%", 
            }}
        >
            <div className="container px-2 xl:px-4">
                <div className="pt-20 pb-10">
                    <AboutMeSection />
                    <ContactSection />
                </div>
            </div>
        </div>
    );
}
