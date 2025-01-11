"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import Chatbox from "@/components/chatbox";
import { Board } from "@/utils/minesweeper";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";

interface PlayerProgress {
  username: string;
  playerColor: string;
  revealedSquares: number;
}

export default function Game() {
  const [board, setBoard] = useState<Board | undefined>(undefined);
  const searchParams = useSearchParams();
  const [_, setRerender] = useState(0);
  const roomId = searchParams.get("id");
  const router = useRouter();
  const [playersProgress, setPlayersProgress] = useState<PlayerProgress[]>([]);

  const { userId } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (!roomId) return;
  
    const loadGameBoard = async () => {
      const roomRef = doc(db, "games", roomId);
  
      try {
        const roomSnap = await getDoc(roomRef);
        if (!roomSnap.exists()) {
          console.error("Game document not found!");
          return;
        }
  
        const data = roomSnap.data();
        if (data?.gameBoard) {
          try {
            const parsedBoard = JSON.parse(data.gameBoard);
            const newBoard = new Board(parsedBoard);
            setBoard(newBoard);
          } catch (error) {
            console.error("Error parsing game board:", error);
          }
        }
      } catch (error) {
        console.error("Error loading game board:", error);
      }
    };
  
    loadGameBoard();
  }, [roomId]);
  
  useEffect(() => {
    if (!roomId) return;
  
    const roomRef = doc(db, "games", roomId);
  
    // Real-time listener for player progress
    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      const data = docSnap.data();
      if (data?.players) {
        setPlayersProgress(data.players);
      }
      if (data?.status === "completed") {
        const winner = data.winner;
        toast({
          title: `Game over! ${winner === userId ? "You won!" : "You lost!"}`,
        });

        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
      
    });
  
    return () => {
      unsubscribe();
    };
  }, [roomId]);

  const forceRerender = () => {setRerender((prev) => prev + 1); console.log("Rerendered");};

  const boardsize = board ? board.boardConfig.length : 0;

  const updateProgress = async () => {
    if (!roomId || !board || !userId) return;

    const revealedSquares = board.progress();
    const roomRef = doc(db, "games", roomId);

    console.log("revealedSquares: ", revealedSquares);

    try {
      const roomSnap = await getDoc(roomRef);
      if (!roomSnap.exists()) {
        console.error("Game document not found!");
        return;
      }

      const data = roomSnap.data();
      const players = data.players || [];

      const updatedPlayers = players.map((player: any) => {
        if (player.userID === userId) {
          return { ...player, revealedSquares };
        }
        return player;
      });
     
      updateDoc(roomRef, { players: updatedPlayers });
      console.log("Player progress updated successfully.");
    
    } catch (error) {
      console.error("Error updating player progress:", error);
    }

    if(revealedSquares === board.nonmineCount()) {
      const roomRef = doc(db, "games", roomId);

      // Update the Firestore database with game completion and winner details
      await updateDoc(roomRef, {
        status: "completed",
        winner: userId, // Assuming the current user who made the winning move is the winner
      });
      
    }

  };


  const handleSquareClick = async (row: number, col: number) => {
  
    const result = board?.reveal(row, col);
    forceRerender();

    if(result === "done") {return;}
    
    if (result === 'X') {
      toast({
        title: "Hit a mine! Resetting the board...",
      });
  
      setTimeout(() => {
        board?.resetBoard();
        forceRerender();
        updateProgress();
      }, 2000);
    } else {
      updateProgress();
    }
  };

  const renderBoard = () => {
    if (!board) return null;

    const currentView = board.currentView();
    return currentView.map((rowArray, row) =>
      rowArray.map((value, col) => (
        <div
          key={`${row}-${col}`}
          className="border border-gray-300 flex justify-center items-center cursor-pointer"
          onClick={() => handleSquareClick(row, col)}
        >
          {value}
        </div>
      ))
    );
  };

  return (
    <div className="flex px-40">
      <div className="flex h-[40vh] w-full">
        {/* Left Sidebar for Chatbox */}
        <div className="w-1/4 p-4">
          <Chatbox />
        </div>

        {/* Game Board */}
        <div className="w-2/3 p-8 flex flex-col">
          <div className="mb-6">
            <div
              className="w-[600px] h-[600px] shadow-2xl"
              style={{
                display: "grid",
                gridTemplateRows: `repeat(${boardsize}, 1fr)`,
                gridTemplateColumns: `repeat(${boardsize}, 1fr)`,
              }}
            >
              {board ? renderBoard() : <p>Loading game board...</p>}
            </div>
          </div>
        </div>

        {/* Right Sidebar for Player Progress */}
        <div className="w-1/4 p-4">
          <h2 className="text-xl font-semibold">Players' Progress</h2>
          <div className="mt-4">
            {playersProgress.length === 0 ? (
              <p>Loading player progress...</p>
            ) : (
              playersProgress.map((player, index) => (
                <div key={index} className="mb-4 p-2 border rounded">
                  <h3 className="text-lg" style={{ color: player.playerColor }}>{player.username}</h3>
                  <p>Revealed Squares: {player.revealedSquares}</p>
                  <Progress
                    value={player.revealedSquares}
                    max={board?.nonmineCount()}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
