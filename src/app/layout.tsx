import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "../components/Header";
import Footer from "../components/Footer";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TOPBEARD | Главная",
  description: "Главная страница сайта",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Header />
        <div className="min-h-screen mb-5">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
