"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useRouter } from "next/navigation"; // To navigate to the waiting room

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function GameTable() {
  const [games, setGames] = useState<any[]>([]); // State to hold games
  const router = useRouter(); // To handle navigation

  useEffect(() => {
    // Fetch unstarted games from Firestore
    const q = query(collection(db, "games"), where("status", "==", "waiting"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const gamesData: any[] = [];
      querySnapshot.forEach((docSnap) => {
        const gameData = docSnap.data();
        const gameId = docSnap.id; // Get the game ID to use as a URL
        if (gameData) {
          gamesData.push({
            id: gameId,
            host: gameData.hostName, // Directly using the host field
            players: gameData.players ? gameData.players.length : 0, // if no players, it will be undefined
            status: gameData.status,
            created: gameData.createdAt?.toDate().toLocaleString(), // Format the timestamp
          });
        }
      });
      setGames(gamesData); // Set the games data into the state
    });

    return () => unsubscribe();
  }, []);

  const joinGame = (gameId: string) => {
    // Redirect to the game's waiting room
    router.push(`/room?id=${gameId}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Host</TableHead>
          <TableHead>Players</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games.map((game) => (
          <TableRow key={game.id} className="cursor-pointer" onClick={() => joinGame(game.id)}>
            <TableCell>{game.host}</TableCell>
            <TableCell>{game.players}</TableCell>
            <TableCell>{game.status}</TableCell>
            <TableCell className="text-right">{game.created}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
