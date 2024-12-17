"use client"
import { useState } from "react";
import { useUser } from "@/context/UserContext";

export default function DropdownWithDialog() {
  const [open, setOpen] = useState(false);
  const { username, setUsername } = useUser();

  return (
    
    <p>Hello {username}!</p>

  )
}
