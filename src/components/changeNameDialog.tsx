"use client";

import {   
  Dialog,   
  DialogContent,   
  DialogDescription,   
  DialogHeader,   
  DialogTitle,   
  DialogFooter, 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

interface ChangeNameDialogProps {   
  open: boolean;   
  onClose: () => void; 
}

export default function ChangeNameDialog({    
  open,    
  onClose  
}: ChangeNameDialogProps) {
   const [name, setName] = useState("");
   const updateUsername = useUser().updateUsername;

   const handleSubmit = async () => {
     if (name.trim()) {
       try {
         await updateUsername(name.trim());
         onClose(); // Ensure dialog closes
       } catch (error) {
         console.error("Failed to update username", error);
       }
     }
   };

   return (
     <Dialog 
       open={open} 
       onOpenChange={(isOpen) => {
         // Only close if isOpen is false
         if (!isOpen) {
           onClose();
         }
       }}
     >
       <DialogContent className="sm:max-w-md">
         <DialogHeader>
           <DialogTitle>Change Name</DialogTitle>
           <DialogDescription>Enter your new name below.</DialogDescription>
         </DialogHeader>
         
         <Input
           placeholder="Enter new name"
           value={name}
           onChange={(e) => setName(e.target.value)}
           onKeyDown={(e) => {
             if (e.key === 'Enter') {
               handleSubmit();
             }
           }}
           className="mb-4"
         />
         
         <DialogFooter className="sm:justify-start">
           <Button variant="ghost" onClick={onClose}>
             Cancel
           </Button>
           <Button
             variant="default"
             onClick={handleSubmit}
           >
             Save
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
   );
}