"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useUser } from "../context/UserContext";

export function ChangeNameDialog({ closeDropdown }: { closeDropdown: () => void }) {
  const { username, setUsername } = useUser(); // Assuming `setUsername` is part of your context
  const [newName, setNewName] = useState(username); // Initialize with the current username
  const [open, setOpen] = useState(false); // State to control the dialog

  const handleSave = () => {
    setUsername(newName); // Update the username in context
    setOpen(false); // Close the dialog
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
        onClick={(e) => {
          e.stopPropagation(); // Prevent dropdown close from propagating
          closeDropdown(); // Explicitly close the dropdown menu
          setOpen(true); // Open the dialog
        }}
      >
        Change Name
      </button>

      {/* Dialog */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Your Name</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new username below to update your profile.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Input Field */}
          <div className="mt-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your new name"
            />
          </div>

          {/* Actions */}
          <AlertDialogFooter>
            <AlertDialogCancel
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
