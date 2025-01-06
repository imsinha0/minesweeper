"use client"
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Button } from '@/components/ui/button';
import Chatbox from '@/components/chatbox';
import GameTable from '@/components/gameTable'; // Assuming this is your game table component

export default function Game() {
  const [board, setBoard] = useState<string[][]>();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("id");
  const router = useRouter();

  // Fetch game board data from Firestore
  useEffect(() => {
    if (roomId) {
      const unsubscribe = onSnapshot(doc(db, "games", roomId), (docSnap) => {
        const data = docSnap.data();
        if (data?.gameBoard) {
          try {
            // Parse the JSON string back into a 2D array
            const parsedBoard = JSON.parse(data.gameBoard);
            setBoard(parsedBoard);
          } catch (error) {
            console.error("Error parsing game board:", error);
          }
        }
      });

      // Cleanup listener when component unmounts
      return () => unsubscribe();
    }
  }, [roomId]);

  const renderBoard = () => {
    const squares = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = board[row][col];
            squares.push(
                <div key={`${row}-${col}`} className="w-8 h-8 border border-gray-300">
                    {square}
                </div>
            );
        }
        
    }
    return squares;
}

  return (
    <div className="flex px-40">
      <div className="flex h-[40vh] w-full">
        <div className="w-1/4 p-4">
          <Chatbox />
        </div>

        <div className="w-2/3 p-8 flex flex-col">
          <h1 className="text-3xl font-bold mb-6">Game</h1>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Game Board</h3>
            {board ? (
        renderBoard()
      ) : (
        <p>Loading game board...</p>
      )}
          </div>
        </div>
      </div>
    </div>
  );
}
