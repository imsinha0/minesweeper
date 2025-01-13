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
import { Dialog, DialogOverlay, DialogTitle, DialogContent, DialogHeader } from "@/components/ui/dialog";


interface PlayerProgress {
  username: string;
  playerColor: string;
  userId: string;
  currentRound: number;
  revealedSquares: number;
  playerRating: number;
}

export default function Game() {
  const [boards, setBoards] = useState<Board[] | undefined>(undefined);
  const [currentRound, setCurrentRound] = useState(1);
  const searchParams = useSearchParams();
  const [_, setRerender] = useState(0);
  const roomId = searchParams.get("id");
  const router = useRouter();
  const [playersProgress, setPlayersProgress] = useState<PlayerProgress[]>([]);
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

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
            const parsedBoards = JSON.parse(data.gameBoard);

            const newBoard = [];
            for (let i = 0; i < parsedBoards.length; i++) {
              newBoard.push(new Board(parsedBoards[i]));
            }
            setBoards(newBoard);

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

  const numRounds = boards?.length;
  
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

        setWinnerId(data.winner);
      }

    });
  
    return () => {
      unsubscribe();
    };
  }, [roomId]);

  useEffect(() => {
    if (winnerId) {
      setShowDialog(true);
    }
  }, [winnerId]);



  const forceRerender = () => {setRerender((prev) => prev + 1); console.log("Rerendered");};

  const boardsize = boards && boards[0] ? boards[0].boardConfig.length : 0;

  const updateProgress = async () => {
    if (!roomId || !boards || !userId) return;

    const revealedSquares = boards[currentRound-1].progress();
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
          return { ...player, revealedSquares, currentRound};
        }
        return player;
      });
     
      updateDoc(roomRef, { players: updatedPlayers });
      console.log("Player progress updated successfully.");
    
    } catch (error) {
      console.error("Error updating player progress:", error);
    }

    if(revealedSquares === boards[currentRound - 1].nonmineCount()) {
      if (currentRound == numRounds){
        const roomRef = doc(db, "games", roomId);
        // Update the Firestore database with game completion and winner details
        await updateDoc(roomRef, {
          status: "completed",
          winner: userId, // Assuming the current user who made the winning move is the winner
        });

        // need way to calculate rating changes, show it, and store it in the database

      } else {
        setCurrentRound((prev) => prev + 1);
        forceRerender();
      }
      
    }

  };


  const handleSquareClick = async (row: number, col: number) => {
  
    const result = boards && boards[currentRound-1]?.reveal(row, col);
    forceRerender();

    if(result === "done") {return;}
    
    if (result === 'X') {
      toast({
        title: "Hit a mine! Resetting the board...",
      });
  
      setTimeout(() => {
        if (boards && boards[currentRound-1]) {
          boards[currentRound-1].resetBoard();
        }
        forceRerender();
        updateProgress();
      }, 2000);
    } else {
      updateProgress();
    }
  };

  const handleGoBack = () => {
    router.push("/");
  };

  const renderBoard = () => {
    if (!boards) return null;

    const currentView = boards[currentRound-1].currentView();
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

<Dialog open={showDialog}>
        <DialogOverlay className="bg-black/50" />
        <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[500px] rounded-lg bg-white p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold mb-4">
              Game Over
            </DialogTitle>
            <p className="mb-4">
              Winner:{" "}
              {playersProgress.find((player) => player.userID === winnerId)?.username}
              
            </p>
            <h3 className="text-xl mb-2">Other Players:</h3>
            <ul>
              {playersProgress
                .filter((player) => player.userID !== winnerId)
                .map((player, index) => (
                  <li key={index} style={{ color: player.playerColor }}>
                    {player.username}
                  </li>
                ))}
            </ul>
            <button
              onClick={handleGoBack}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Go Back to Main Page
            </button>
          </DialogHeader>
        </DialogContent>
      </Dialog>


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
              {boards ? renderBoard() : <p>Loading game board...</p>}
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
                  <h3 className="text-lg" style={{ color: player.playerColor }}>{player.username} ({player.playerRating})</h3>
                  <p>Round: {player.currentRound? player.currentRound : 1}</p>
                  <p>Revealed Squares: {player.revealedSquares}</p>
                  <Progress
                    value={player.revealedSquares}
                    max={boards ? boards[currentRound - 1]?.nonmineCount() : 1}
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
