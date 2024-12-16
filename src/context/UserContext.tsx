"use client";

// context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "@/firebaseConfig"; // Import Firestore instance
import { collection, addDoc, doc, getDoc } from "firebase/firestore";

// Define UserContext structure with userId, username, and color
const UserContext = createContext<{ userId: string; username: string; color: string }>({
  userId: "",
  username: "",
  color: "",
});

// Helper to generate random username
const generateRandomUsername = () => {
  const adjectives = ["Cool", "Fast", "Happy", "Bright", "Creative"];
  const nouns = ["Tiger", "Phoenix", "Unicorn", "Wolf", "Eagle"];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(1 + Math.random() * 9);
  return `${randomAdjective}${randomNoun}${randomNumber}`;
};

// Helper to generate random dark color
const generateRandomDarkColor = () => {
  const darkColors = [
    "#2C3E50", // dark blue
    "#34495E", // dark grayish blue
    "#1A237E", // dark indigo
    "#8B0000", // dark red
    "#4B0082", // indigo
    "#D32F2F", // dark red
    "#C2185B", // dark pink
    "#7B1FA2", // dark purple
    "#cbec12", // dark green
  ];
  return darkColors[Math.floor(Math.random() * darkColors.length)];
};

// Provider Component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [color, setColor] = useState<string>("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    const getUserFromFirestore = async (userId: string) => {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserId(userId);
        setUsername(userData.username);
        setColor(userData.color);
      }
    };

    const createNewUser = async () => {
      const newUsername = generateRandomUsername();
      const newColor = generateRandomDarkColor();
      const usersCollectionRef = collection(db, "users");

      const docRef = await addDoc(usersCollectionRef, {
        username: newUsername,
        color: newColor,
        createdAt: new Date(),
      });

      const newUserId = docRef.id;
      localStorage.setItem("userId", newUserId);
      setUserId(newUserId);
      setUsername(newUsername);
      setColor(newColor);
    };

    if (storedUserId) {
      getUserFromFirestore(storedUserId);
    } else {
      createNewUser();
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId, username, color }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use UserContext
export const useUser = () => useContext(UserContext);
