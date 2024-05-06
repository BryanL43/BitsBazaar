import { Inria_Sans } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.css';
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";

const inter = Inria_Sans({ subsets: ["latin"], weight: ["300", "400", "700"] });

export const metadata = {
  title: "BitsBazaar",
  description: "E-commerce site for PC parts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
