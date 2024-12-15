// context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "@/firebaseConfig"; // Import Firestore instance
import { collection, addDoc, doc, getDoc } from "firebase/firestore";

// Create Context
const UserContext = createContext<{ username: string}>({ username: "" });

// Helper to generate random username
const generateRandomUsername = () => {
  const adjectives = ["Cool", "Fast", "Happy", "Bright", "Creative"];
  const nouns = ["Tiger", "Phoenix", "Unicorn", "Wolf", "Eagle"];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(1 + Math.random() * 9);
  return `${randomAdjective}${randomNoun}${randomNumber}`;
};

// Provider Component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    const getUsernameFromFirestore = async (userId: string) => {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUsername(userDoc.data().username);
      }
    };

    const createNewUser = async () => {
      const newUsername = generateRandomUsername();
      const usersCollectionRef = collection(db, "users");

      const docRef = await addDoc(usersCollectionRef, {
        username: newUsername,
        createdAt: new Date(),
      });

      const userId = docRef.id;
      localStorage.setItem("userId", userId);
      setUsername(newUsername);
    };

    if (storedUserId) {
      getUsernameFromFirestore(storedUserId);
    } else {
      createNewUser();
    }
  }, []);

  return <UserContext.Provider value={{ username }}>{children}</UserContext.Provider>;
};

// Hook to use UserContext
export const useUser = () => useContext(UserContext);
