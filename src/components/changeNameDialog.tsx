"use client";



import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose, DialogHeader} from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { db } from "@/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
{/*
export function ChangeNameDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent aria-modal="true">
        <p>Test dialog content</p>
      </DialogContent>
      <DialogFooter>
        <Button>Save Changes</Button>
    </DialogFooter>
    </Dialog>
  );
}

const  userId  = useUser().userId;
  const updateUsername = useUser().updateUsername;
  const [newName, setNewName] = useState("");

  const handleNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && userId) {
      try {
        await updateDoc(doc(db, "users", userId), {
          username: newName.trim(),
        });
        updateUsername(newName.trim());
        setNewName("");
      } catch (error) {
        console.error("Error updating name:", error);
      }
    }
  };

*/}

interface ChangeNameDialogProps {
    open: boolean;
    onClose: () => void;
  }

  
export function ChangeNameDialog({ open, onClose }: ChangeNameDialogProps) {
    const { userId, updateUsername } = useUser();
    const [newName, setNewName] = useState("");
  
    const handleNameChange = async (e: React.FormEvent) => {
      e.preventDefault();
      if (newName.trim() && userId) {
        try {
          await updateDoc(doc(db, "users", userId), {
            username: newName.trim(),
          });
          updateUsername(newName.trim());
          setNewName("");
          onClose(); // Close dialog after successful update
        } catch (error) {
          console.error("Error updating name:", error);
        }
      }
    };
  
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent aria-modal="true">
          <DialogHeader>
            <DialogTitle>Change Name</DialogTitle>
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={onClose}
                className="absolute top-4 right-4"
              >
                X
              </Button>
            </DialogClose>
          </DialogHeader>
          <form onSubmit={handleNameChange}>
            <div className="mb-4">
              <Input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new name"
                aria-label="New name"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }