import Image from "next/image";
import ContactSection from "@/components/main/section/Contact";
import AboutMeSection from "@/components/main/section/AboutMe";

export default function Home() {
    return (
        <div className="container px-2 xl:px-4">
            <div className="pt-20 pb-10">
                <AboutMeSection />
                <ContactSection />
            </div>
        </div>
    );
}
