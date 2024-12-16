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
import { useState } from "react";
import { ChangeNameDialog } from "./ChangeNameDialog";

function Header() {
  const { username, color } = useUser();
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const handleOpenDialog = (dialogType: string) => setActiveDialog(dialogType);
  const handleCloseDialog = () => setActiveDialog(null);

  return (
    <nav className="p-3 ml-5 pr-8">
      <div className="mx-auto flex justify-between items-center">
        <Link href="/" className="text-3xl">
          Minesweeper
        </Link>

        <div className="flex space-x-4 items-center">
          <Link
            href="/user"
            style={{ color }}
            className="text-lg"
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
                onClick={() => handleOpenDialog("name")}
              >
                Change Name
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ChangeNameDialog
            open={activeDialog === "name"}
            onClose={handleCloseDialog}
          />
        </div>
      </div>
    </nav>
  );
}

export default Header;
