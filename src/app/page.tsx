"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Chatbox from "../components/chatbox"
import { UserProvider, useUser } from "../context/UserContext";

import { useEffect, useState } from "react";
import { doc, setDoc, addDoc, getDoc, collection } from "firebase/firestore";
import { db } from "@/firebaseConfig"; // Import Firestore instance

export default function Home() {


  return (
    <UserProvider>
      <div className="flex px-40">
  <div className="w-1/3 p-4 ">
    <div >
      <Chatbox/>
    </div>
  </div>

  <div className ="w-2/3 p-4">
    <div className ="bg-white shadow-lg rounded-lg p-4">
      
    </div>
  </div>
</div>
    </UserProvider>
  );


  
}
