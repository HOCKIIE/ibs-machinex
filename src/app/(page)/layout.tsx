import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800","900"],
  style: ["normal", "italic"],
});

export const metadata : Metadata = {
  title: "IBS Machinex Co.,ltd.",
  description: "IBS Machinex Co.,lt",
};

export default function RootLayout({children}:{children: React.ReactNode}) {
  return (
    <html lang="en">
      <body
        className={`${kanit.className} antialiased`}
      >
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
