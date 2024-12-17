"use client";

import { SpeakerLoudIcon, GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import * as React from "react";
import {Input} from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {
  const { username, color, updateUsername, updateUserColor } = useUser();
  const [isChangeNameOpen, setIsChangeNameOpen] = React.useState(false);
  const [isChangeColorOpen, setIsChangeColorOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const [newName, setNewName] = React.useState("");
  const [newColor, setNewColor] = React.useState(color);

  const predefinedColors = ["red", "blue", "green", "purple", "orange"];

  React.useEffect(() => {
    // Prevent body scrolling when any dialog is open
    document.body.style.overflow = isChangeNameOpen || isChangeColorOpen ? "hidden" : "auto";
  }, [isChangeNameOpen, isChangeColorOpen]);

  const handleNameChange = () => {
    if (newName.trim()) {
      updateUsername(newName);
      setIsChangeNameOpen(false);
      setNewName("");
    }
  };

  const handleColorChange = (selectedColor: string) => {
    updateUserColor(selectedColor);
    setNewColor(selectedColor);
    setIsChangeColorOpen(false);
  };

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

          {/* Settings Dropdown */}
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <GearIcon className="w-5 h-5" />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48 p-2 mt-2 rounded-lg shadow-lg bg-white text-gray-800 border border-gray-200">
              <DropdownMenuItem onClick={() => setIsChangeNameOpen(true)}>
                Change name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsChangeColorOpen(true)}>
                Change color
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dialog for Change Name */}
          {isChangeNameOpen && (<div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-base font-semibold text-gray-900" id="modal-title">Change name</h3>
              <div className="mt-2">
                <p className="">Enter your new display name</p>
              </div>
              <div className="mt-3">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="New name"
                />
                </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button type="button" onClick={handleNameChange}  
          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">Rename</button>
          <button type="button" onClick={() => setIsChangeNameOpen(false)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</div>

  )}

          {/* Dialog for Change Color */}
          {isChangeColorOpen && (
            <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
          
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h2 className="text-xl font-semibold mb-4">Change Color</h2>
                        <div className="flex flex-wrap justify-center gap-4 mb-4">
                          {predefinedColors.map((presetColor) => (
                            <button
                              key={presetColor}
                              style={{ backgroundColor: presetColor }}
                              className={`w-10 h-10 rounded-full border-2 ${
                                newColor === presetColor
                                  ? "border-black"
                                  : "border-transparent"
                              }`}
                              onClick={() => handleColorChange(presetColor)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      onClick={() => setIsChangeColorOpen(false)}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
