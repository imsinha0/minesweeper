"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import Chatbox from "@/components/chatbox";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";

export default function Room() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("id");
  const [players, setPlayers] = useState<{ userID: string; username: string; playerColor: string }[]>([]);
  const [gameSettings, setGameSettings] = useState<string>("7x7");
  const [enableHints, setEnableHints] = useState(false);
  const [roomUrl, setRoomUrl] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [hostID, setHostID] = useState<string | null>(null);

  const { userId, username, color } = useUser();
  const currentUser = { userID: userId, username: username };

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
          if (data.hostID) setHostID(data.hostID); // Set the hostID from the database
        }
        if (data?.status === "started") setGameStarted(true);
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
              (player: { userID: string }) => player.userID === currentUser.userID
            );

            if (!userAlreadyInRoom) {
              playersList.push({
                userID: currentUser.userID,
                username: currentUser.username,
                playerColor: color || "#000000", // Use the color from context
              });

              await updateDoc(roomRef, {
                players: playersList,
              });
            }
          }
        }
      };

      addCurrentUserToRoom();

      // Clean-up function to remove user from the room when they leave
      const removeUserFromRoom = async () => {
        const roomRef = doc(db, "games", roomId);
        const roomDoc = await getDoc(roomRef);
        if (roomDoc.exists()) {
          const roomData = roomDoc.data();
          const playersList = roomData?.players || [];

          // Remove the current user from the players list
          const updatedPlayersList = playersList.filter(
            (player: { userID: string }) => player.userID !== currentUser.userID
          );

          await updateDoc(roomRef, {
            players: updatedPlayersList,
          });
        }
      };

      // Cleanup when the user leaves or the component unmounts
      return () => {
        removeUserFromRoom();
        unsubscribe();
      };
    }
  }, [roomId, userId, username, color]);

  const startGame = async () => {
    if (roomId) {
      await updateDoc(doc(db, "games", roomId), {
        status: "started",
        gameMode: gameSettings,
        hintsEnabled: enableHints,
      });
      setGameStarted(true);
    }
  };

  // Check if the current user is the host
  const isHost = hostID === currentUser.userID;

  return (
    <div className="flex px-40">
      <div className="flex h-[40vh] w-full">
        <div className="w-1/4 p-4">
          <h2 className="text-lg font-semibold mb-2">Game Chat</h2>
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
                      <span className="text-gray-500">({player.userID})</span>
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
                      className={`accent-blue-500 ${!isHost ? "cursor-not-allowed" : ""}`}
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
              <input
                readOnly
                value={roomUrl}
                className="border p-2 rounded w-full text-sm text-pink-500"
              />
              <Button
                onClick={() => navigator.clipboard.writeText(roomUrl)}
                className="bg-blue-500 text-white px-3 py-2 rounded"
              >
                Copy Link
              </Button>
            </div>
          </div>

          <div>
            <Button
              onClick={startGame}
              disabled={gameStarted || !isHost}
              className={`w-full py-3 text-lg font-semibold text-white rounded ${
                gameStarted || !isHost
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              {gameStarted ? "Game Started" : "START GAME"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
