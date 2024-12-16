import { Dialog, DialogTrigger, DialogContent } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

export function ChangeColorDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent aria-modal="true">
        <p>Test dialog content</p>
        <Button onClick={() => console.log("Closing dialog")}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}



{/*
"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { db } from "@/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { HexColorPicker } from "react-colorful";

interface ChangeColorDialogProps {
  onClose: () => void;
}

export function ChangeColorDialog({ onClose }: ChangeColorDialogProps) {
  const { userId, color, updateUserColor } = useUser();
  const [newColor, setNewColor] = useState(color);

  const handleColorChange = async () => {
    if (userId) {
      try {
        await updateDoc(doc(db, "users", userId), {
          color: newColor
        });
        updateUserColor(newColor);
        onClose();
      } catch (error) {
        console.error("Error updating color:", error);
      }
    }
  };

  return (
    <DialogContent aria-modal="true">
      <DialogHeader>
        <DialogTitle>Change Your User Color</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center space-y-4">
        <HexColorPicker color={newColor} onChange={setNewColor} />
        <Input 
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          placeholder="Enter hex color code"
        />
        <div 
          className="w-16 h-16 rounded-full" 
          style={{ backgroundColor: newColor }}
        />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleColorChange}>Save Color</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

*/}