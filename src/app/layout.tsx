

import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/header";
import {UserProvider} from "../context/UserContext";
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Minesweeper",
  description: "Enjoy minesweeper with friends!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full overflow-x-hidden">
        <UserProvider>
          <Header/>
            {children}
        </UserProvider> 
        <Toaster />
      </body>
    </html>
  );
}
