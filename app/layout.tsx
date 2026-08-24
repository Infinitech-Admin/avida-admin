import "./globals.css";
import PrelineScript from "./utility/prelinescript";
import { Metadata } from "next";
import { Poppins } from "next/font/google";

// Define metadata for the layout
export const metadata: Metadata = {
  title: "ALVEO Homes | Admin",
  description: "Lerom Ipsum.",
};

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.className}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
