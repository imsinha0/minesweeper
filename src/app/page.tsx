"use client"

import Chatbox from "../components/chatbox";
import { Button } from "../components/ui/button";
import GameTable from "@/components/gameTable";
import {db} from "@/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation"; // Import from next/navigation
import { useUser } from "@/context/UserContext";

export default function Home() {
  const router = useRouter();
  const { userId, username } = useUser();

  const createGame = async () => {
    try {
      // Add a new game document to the "games" collection
      const gameRef = await addDoc(collection(db, "games"), {
        createdAt: Timestamp.now(),
        status: "waiting", // Initial status for a new game
        hostId: userId, // Set the host to the current user
        hostName: username, // Set the host name to the current user's name
      });

      console.log("Game created with ID:", gameRef.id);

      // Navigate to /room with the game ID
      router.push(`/room?id=${gameRef.id}`);
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  return (
    <div className="flex px-40">
      <div className="w-1/4 p-4 h-[80vh]">
        <div>
          <Chatbox />
        </div>
      </div>

      <div className="w-2/4 p-4">
        <div className="bg-white shadow-lg rounded-lg pr-4 pl-4 h-[80vh]">
          <GameTable />
        </div>
      </div>

      <div className="w-1/4 p-4 flex items-center justify-center">
        <Button
          onClick={createGame}
          className="w-full h-10 flex items-center justify-center"
        >
          Create A Game
        </Button>
      </div>
    </div>
  );
}
