"use client"
import { useState } from "react";
import { useUser } from "@/context/UserContext";


export default function DropdownWithDialog() {
  const [open, setOpen] = useState(false);
  const { username, setUsername } = useUser();
  const rating = useUser().rating;

  

  return (
    <div>
    <p>Hello {username}!</p>
    
    <p>Your rating is: {rating}</p>
    </div>
  )
}
