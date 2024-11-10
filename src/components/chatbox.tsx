"use client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect} from "react";
import { db } from "@/firebaseConfig"; // Import Firestore instance
import { collection, addDoc, onSnapshot, query, orderBy, DocumentData, getDocs} from "firebase/firestore";

interface Message {
    id: string;
    username: string;
    text: string;
    timestamp: Date;
}

export default function Chatbox() {

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");

    {/*
    useEffect(() => {
        // Define a query to order messages by timestamp in ascending order
        const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
        
        // Subscribe to Firestore updates in real-time
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map((doc) => {
                const data = doc.data() as DocumentData;
                return {
                    id: doc.id,
                    username: data.username,
                    text: data.text,
                    timestamp: data.timestamp.toDate(),
                } as Message;
            }));
        });

        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, []);
    */}
    
    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newMessage.trim() !== "") {
            setNewMessage(""); // Clear input field after sending message
            try {
                console.log("Adding message to Firestore...");
                await addDoc(collection(db, "messages"), {
                    username: "Me", // Replace with a dynamic username if needed
                    text: newMessage,
                    timestamp: new Date(),
                });
                alert("Message sent successfully!");
            } catch  {
                console.log("oof");
            }

        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-4">
            <p className="text-center">Chatbox</p>

            <ScrollArea className="h-[500px] rounded-md p-4 space-y-2">
                {messages.map((message) => (
                    <div key={message.id} className="text-sm">
                        <span className="font-bold">{message.username}:</span> {message.text}
                    </div>
                ))}
            </ScrollArea>

            <Input
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-[300px] mt-2"
            />
        </div>
    );
}
