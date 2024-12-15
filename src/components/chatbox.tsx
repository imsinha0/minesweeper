"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef } from "react";
import { db } from "@/firebaseConfig"; // Import Firestore instance
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { useUser } from "../context/UserContext";

interface Message {
    id: string;
    username: string;
    text: string;
    timestamp: Date;
}

const messagesCollection = collection(db, "messages");

export default function Chatbox() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const username = useUser().username;

    // Ref to handle scrolling
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSendMessage(message);
            setMessage(""); // Clear the input after sending
        }
    };

    const handleSendMessage = async (message: string) => {
        try {
            if (message.trim()) {
                const docRef = await addDoc(messagesCollection, {
                    text: message,
                    timestamp: Timestamp.now(),
                    username: username,
                });
                console.log("document written with ID: ", docRef.id);
            }
        } catch (error) {
            console.error("Error adding message: ", error);
        }
    };

    useEffect(() => {
        const q = query(messagesCollection, orderBy("timestamp"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Message)));
        });
        return () => unsubscribe();
    }, []);

    const scrollToBottom = () => {
        scrollAreaRef.current?.scrollIntoView(false)
    }
    // Scroll to the bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="bg-white shadow-lg rounded-lg p-4">
            <p className="text-center">Lobby Chat</p>

            <ScrollArea ref={scrollAreaRef} className="h-[500px] rounded-md p-4 space-y-2 overflow-y-auto">
                {messages.map((message: Message) => (
                    <div key={message.id} className="p-2 rounded-md">
                        <p><strong>{message.username}:</strong> {message.text}</p>
                    </div>
                ))}
            </ScrollArea>

            <Input
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
            />
        </div>
    );
}
