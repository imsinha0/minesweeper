"use client";

import Link from "next/link"
import { SpeakerLoudIcon, SpeakerOffIcon, SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { createContext, useContext} from 'react';

const SettingsContext = createContext({
  volume: "on",
  setVolume: (volume: "on" | "off") => {},
});



function Header() {

  const settings = useContext(SettingsContext);

  function handleChangeVolume() {
    settings.setVolume((volume) => (volume === "on" ? "off" : "on"));
  }

      return (
<nav className="p-4">
  <div className="mx-auto flex justify-between items-center">
        <Link href="/" className="text-3xl hover:text-blue-600">
        Minesweeper
        </Link>
        
        <div className="flex space-x-4 items-center">
        <Link href="/user" className="text-l text-green-600 hover:text-blue-600">
        Username
        </Link>
        <Link href="/" className="text-4xl font-bold hover:text-blue-600">
          <SpeakerLoudIcon/>
        </Link>
        </div>

  </div>
</nav>
)}

export default Header;