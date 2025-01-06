"use client"

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Chatbox from '@/components/chatbox';
import { Board } from '@/utils/minesweeper';

export default function Game() {
  const [board, setBoard] = useState<Board | undefined>(undefined);
  const searchParams = useSearchParams();
  const [_, setRerender] = useState(0);
  const roomId = searchParams.get('id');
  const router = useRouter();

  // Fetch game board data from Firestore
  useEffect(() => {
    if (roomId) {
      const unsubscribe = onSnapshot(doc(db, 'games', roomId), (docSnap) => {
        const data = docSnap.data();
        if (data?.gameBoard) {
          try {
            // Parse the JSON string back into a 2D array
            const parsedBoard = JSON.parse(data.gameBoard);
            const newBoard = new Board(parsedBoard);
            setBoard(newBoard);
          } catch (error) {
            console.error('Error parsing game board:', error);
          }
        }
      });

      // Cleanup listener when component unmounts
      return () => unsubscribe();
    }
  }, [roomId]);

  const forceRerender = () => {
    setRerender(prev => prev + 1);  // Increment the counter to trigger a rerender
  };

  const boardsize = board ? board.boardConfig.length : 0;

  const handleSquareClick = (row: number, col: number) => {
    // Update the board's view when a square is clicked
    const result = board?.reveal(row, col);

    if (result === 'X') {
      alert('Game over!');  // Show an alert when a mine is clicked
    }
    
    forceRerender();
  };

  const renderBoard = () => {
    const squares = [];
    const currentView = board ? board.currentView() : [];
    for (let row = 0; row < boardsize; row++) {
      for (let col = 0; col < boardsize; col++) {
        squares.push(
          <div
            key={`${row}-${col}`}
            className="border border-gray-300 flex justify-center items-center cursor-pointer"
            onClick={() => handleSquareClick(row, col)}
          >
            {currentView[row][col]}
          </div>
        );
      }
    }
    return squares;
  };

  return (
    <div className="flex px-40">
      <div className="flex h-[40vh] w-full">
        <div className="w-1/4 p-4">
          <Chatbox />
        </div>

        <div className="w-2/3 p-8 flex flex-col">
          <div className="mb-6">
            <div
              className="w-[600px] h-[600px] shadow-2xl"
              style={{
                display: 'grid',
                gridTemplateRows: `repeat(${boardsize}, 1fr)`,
                gridTemplateColumns: `repeat(${boardsize}, 1fr)`,
              }}
            >
              {board ? renderBoard() : <p>Loading game board...</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
