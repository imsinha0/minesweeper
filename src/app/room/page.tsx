"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import Chatbox from "@/components/chatbox";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import {Input} from "@/components/ui/input";
import {createMinesweeperBoard} from "@/utils/minesweeper";

export default function Room() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("id");
  const [players, setPlayers] = useState<{ userID: string; username: string; playerColor: string }[]>([]);
  const [gameSettings, setGameSettings] = useState<string>("7x7");
  const [roomUrl, setRoomUrl] = useState("");
  const [hostID, setHostID] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  


  const { userId, username, color } = useUser();

  useEffect(() => {
    if (roomId) {
      setRoomUrl(`${window.location.origin}/room?id=${roomId}`);

      const unsubscribe = onSnapshot(doc(db, "games", roomId), (docSnap) => {
        const data = docSnap.data();
        if (data?.players) {
          const validPlayers = data.players.filter(
            (player: { userID: string; username: string }) =>
              player.userID && player.username
          );
          setPlayers(validPlayers);

          if (data.gameMode) setGameSettings(data.gameMode);
          if (data.hostId) setHostID(data.hostId);

          if (data.status === "started") {
            router.push(`/game?id=${roomId}`);
          }
        }


      });

      // Add the current user to the room when the component mounts
      const addCurrentUserToRoom = async () => {
        if (userId && username) {
          const roomRef = doc(db, "games", roomId);
          const roomDoc = await getDoc(roomRef);
          if (roomDoc.exists()) {
            const roomData = roomDoc.data();
            const playersList = roomData?.players || [];

            const userAlreadyInRoom = playersList.some(
              (player: { userID: string }) => player.userID === userId
            );

            if (!userAlreadyInRoom) {
              playersList.push({
                userID: userId,
                username: username,
                playerColor: color || "#000000", // Use the color from context
              });

              await updateDoc(roomRef, {
                players: playersList,
              });
              console.log(playersList);
            }
          }
        }
      };

      addCurrentUserToRoom();
      
        // Remove user from room on unload
        const handleUnload = async () => {
          const roomRef = doc(db, "games", roomId);
          const roomDoc = await getDoc(roomRef);
          if (roomDoc.exists()) {
            const roomData = roomDoc.data();
            if (roomData.status !== "started") {
              removeUserFromRoom();
            }
          }
        };
    
        window.addEventListener("beforeunload", handleUnload);
    
        // Cleanup function
        return () => {
          window.removeEventListener("beforeunload", handleUnload);
          unsubscribe();
        };

    }
  }, [roomId, userId, username, color]);
    
  // start the game

  const startGame = async () => {
    const numRows = Number(gameSettings[0]);
    const numCols = Number(gameSettings[2]);
    const numMines = Math.floor(Math.sqrt(numRows*numCols));

    if (roomId) {
      await updateDoc(doc(db, "games", roomId), {
        status: "started",
        gameBoard: JSON.stringify(createMinesweeperBoard(numRows, numCols, numMines)),
      });
    }
    router.push(`/game?id=${roomId}`);

  };


  const handleClick = () => {
    navigator.clipboard.writeText(roomUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  };

  // Check if the current user is the host
  const isHost = (hostID === userId);

  const removeUserFromRoom = async () => {
    if (roomId && userId) {
      const roomRef = doc(db, "games", roomId);
      const roomDoc = await getDoc(roomRef);
      if (roomDoc.exists()) {
        const roomData = roomDoc.data();
        const playersList = roomData?.players || [];

        // Remove the current user from the players list
        const updatedPlayersList = playersList.filter(
          (player: { userID: string }) => player.userID !== userId
        );

        await updateDoc(roomRef, {
          players: updatedPlayersList,
        });
      }
    }
  };

  return (
    <div className="flex px-40">
      <div className="flex h-[40vh] w-full">
        <div className="w-1/4 p-4">
          <Chatbox />
        </div>

        <div className="w-2/3 p-8 flex flex-col">
          <h1 className="text-3xl font-bold mb-6">Waiting Room</h1>

          <div className="flex justify-between items-start mb-6">
            <div className="w-1/2">
              <h3 className="font-semibold text-gray-700 mb-2">Players</h3>
              <div className="border rounded-lg p-4">
                {players.length > 0 && (
                  players.map((player, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold" style={{ color: player.playerColor }}>
                        {player.username}
                      </span>
                      {hostID === player.userID && <span className="text-xs text-gray-500">Host</span>}
                      {isHost && (
                        <span
                          className="text-xs text-gray-500 cursor-pointer"
                          onClick={() => {
                            const updatedPlayers = players.filter(
                              (p) => p.userID !== player.userID
                            );
                            setPlayers(updatedPlayers);
                            updateDoc(doc(db, "games", roomId), { players: updatedPlayers });
                          }}
                        >
                          Remove
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="w-1/2 pl-4">
              <h3 className="font-semibold text-gray-700 mb-2">Game Settings</h3>
              <div className="flex flex-col space-y-2">

              {["5x5", "7x7", "9x9"].map((mode) => (
                <label key={mode} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gameMode"
                    value={mode}
                    checked={gameSettings === mode}
                    onChange={() => {
                      if (isHost) {
                        setGameSettings(mode);
                        updateDoc(doc(db, "games", roomId), { gameMode: mode });
                      }
                    }}
                    disabled={!isHost}
                    className={`accent-black ${!isHost ? "cursor-not-allowed" : ""}`}
                  />
                  <span className="text-gray-700">{mode}</span>
                </label>
              ))}



              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Inviting Friends</h3>
            <div className="flex items-center space-x-2">
              <Input
                readOnly
                value={roomUrl}
                className="border p-2 rounded w-full text-sm text-gray-500"
              />
                  <Button onClick={handleClick} className="px-3 py-2 rounded w-32">
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
            </div>
          </div>
          
          {isHost && 
          <div>
            <Button
              onClick={startGame}
              disabled={!isHost}
              className={`w-full py-3 text-lg font-semibold text-white rounded ${
                !isHost
                  ? "cursor-not-allowed"
                  : ""
              }`}
            >
              {"START GAME"}
            </Button>
          </div>
          }
          {!isHost &&
          
          //create a button to leave the room
          <div>
            <Button
              onClick={() => {
                removeUserFromRoom();
                window.location.href = "/";
              }}
              className="w-full py-3 text-lg font-semibold text-white rounded"
            >
              Leave Room
            </Button>
          </div>
          }

        </div>
      </div>
    </div>
  );
}
