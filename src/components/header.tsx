"use client"
import { useState } from "react";
import { GearIcon, SpeakerLoudIcon } from "@radix-ui/react-icons"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import ChangeNameDialog from "./ChangeNameDialog";
import { buttonVariants } from "./ui/button";
import { useUser } from "@/context/UserContext";


function Header() {
  const { username, color } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown

  return (
    <nav className="p-3 ml-5 pr-8">
      <div className="mx-auto flex justify-between items-center">
        
        <Link href="/" className="text-3xl">
          Minesweeper
        </Link>

        <div className="flex space-x-4 items-center">
          <Link href="/user" style={{ color }} className="text-lg">
            {username}
          </Link>

          <Link href="/" className="text-4xl font-bold">
            <SpeakerLoudIcon />
          </Link>

          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <GearIcon className="w-5 h-5" />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48 p-2 mt-2 rounded-lg shadow-lg bg-white text-gray-800 border border-gray-200">
              <DropdownMenuItem>
                <ChangeNameDialog closeDropdown={() => setDropdownOpen(false)} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

export default Header;
