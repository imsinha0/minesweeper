

import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/header";
import {UserProvider} from "../context/UserContext";

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
      <body>
        <UserProvider>
          <Header/>
            {children}
        </UserProvider> 
      </body>
    </html>
  );
}
