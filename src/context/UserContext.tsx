"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "@/firebaseConfig";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";

// Expand the context to include update methods
interface UserContextType {
  userId: string;
  username: string;
  color: string;
  updateUsername: (newUsername: string) => Promise<void>;
  updateUserColor: (newColor: string) => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  userId: "",
  username: "",
  color: "",
  updateUsername: async () => {},
  updateUserColor: async () => {},
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
    "#2C3E50", "#34495E", "#1A237E", "#8B0000", 
    "#4B0082", "#D32F2F", "#C2185B", "#7B1FA2", "#cbec12"
  ];
  return darkColors[Math.floor(Math.random() * darkColors.length)];
};

// Provider Component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [color, setColor] = useState<string>("");

  // Method to update username in Firestore and local state
  const updateUsername = async (newUsername: string) => {
    if (!userId) return;

    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { username: newUsername });
      setUsername(newUsername);
    } catch (error) {
      console.error("Failed to update username:", error);
    }
  };

  // Method to update user color in Firestore and local state
  const updateUserColor = async (newColor: string) => {
    if (!userId) return;

    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { color: newColor });
      setColor(newColor);
    } catch (error) {
      console.error("Failed to update user color:", error);
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    const getUserFromFirestore = async (userId: string) => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserId(userId);
          setUsername(userData.username);
          setColor(userData.color);
        } else {
          // If stored user doesn't exist, create a new one
          await createNewUser();
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        await createNewUser();
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
    <UserContext.Provider value={{ 
      userId, 
      username, 
      color, 
      updateUsername,
      updateUserColor 
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};