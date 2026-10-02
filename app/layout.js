import { Inter } from "next/font/google";
import "./globals.css";
import AppContextProvider from "@/context/AppContext";
import { Toaster} from 'react-hot-toast';
import Provider from "./Provider";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});


export const metadata = {
  title: "SwiftCharge",
  description: "Ecommerce App",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppContextProvider>
          <Toaster />
          <Provider>
            {children}
          </Provider>
        </AppContextProvider>
      </body>
    </html>
    </ClerkProvider>
    
  );
}
