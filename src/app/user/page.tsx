"use client"
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function DropdownWithDialog() {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu modal={false}>
  <DropdownMenuTrigger asChild>
    <Button variant="default" className="h-8 w-8 p-0">
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem
    >
      Edit
    </DropdownMenuItem>
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem>
          Children Button
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        This is a modal.
      </DialogContent>
    </Dialog>
  </DropdownMenuContent>
</DropdownMenu>
  );
}
