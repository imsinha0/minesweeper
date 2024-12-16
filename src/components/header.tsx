"use client";

import Link from "next/link";
import { SpeakerLoudIcon, GearIcon } from "@radix-ui/react-icons";
import { useUser } from "../context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChangeNameDialog from "./changeNameDialog";
import { useState } from "react";
import { db } from "@/firebaseConfig"; // Import Firestore instance
import { doc, updateDoc } from "firebase/firestore";

function Header() {
  const { userId, username, color} = useUser(); // Extract from context
  const [changeName, setChangeName] = useState(false);

  

  return (
    <nav className="p-3 ml-5 pr-8">
      <div className="mx-auto flex justify-between items-center">
        <Link href="/" className="text-3xl">
          Minesweeper
        </Link>

        <div className="flex space-x-4 items-center">
          <Link
            href="/user"
            style={{ color }} // Apply dynamic color from the context
            className="text-lg" // Adjust the text size as needed
          >
            {username}
          </Link>

          <Link href="/" className="text-4xl font-bold">
            <SpeakerLoudIcon />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <GearIcon className="w-5 h-5" />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48 p-2 mt-2 rounded-lg shadow-lg bg-white text-gray-800 border border-gray-200">
            <DropdownMenuItem 
              className="px-4 py-2 text-sm rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-200 transition-colors"
              onClick={() => setChangeName(true)}
            >
              Change Name
            </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-2 text-sm rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-200 transition-colors">
                Change user color
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-2 text-sm rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-200 transition-colors">
                Change game color
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-2 text-sm rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-200 transition-colors">
                Account options
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Change Name Dialog */}
        <ChangeNameDialog
        open={changeName}
        onClose={() => setChangeName(false)}
      />

      </div>
    </nav>
  );
}

export default Header;
