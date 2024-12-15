"use client";

import Link from "next/link"
import { SpeakerLoudIcon, SpeakerOffIcon, SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { useUser } from "../context/UserContext";

function Header() {
  const { username } = useUser(); // Extract username from the context


      return (
<nav className="p-4">
  <div className="mx-auto flex justify-between items-center">
        <Link href="/" className="text-3xl hover:text-blue-600">
        Minesweeper
        </Link>
        
        <div className="flex space-x-4 items-center">
        <Link href="/user" className="text-l text-green-600 hover:text-blue-600">
        {username}
        </Link>
        <Link href="/" className="text-4xl font-bold hover:text-blue-600">
          <SpeakerLoudIcon/>
        </Link>
        </div>

  </div>
</nav>
)}

export default Header;