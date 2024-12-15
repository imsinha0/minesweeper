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
    color: string;
}

const messagesCollection = collection(db, "messages");

export default function Chatbox() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const { username, color } = useUser();

    // Ref for the last message element to scroll to it
    const lastMessageRef = useRef<HTMLDivElement | null>(null);

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
                    color: color,
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

    useEffect(() => {
        // Scroll to the last message when messages are updated
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]); // Dependency on messages to trigger scrolling

    return (
        <div className="bg-white shadow-lg rounded-lg p-4 text-sm">
            <p className="text-center text-sm">Lobby Chat</p>

            <ScrollArea className="h-[500px] rounded-md pt-2 pb-2 space-y-2">
                {messages.map((message: Message) => (
                    <div key={message.id} className="p-1 rounded-md">
                        <p><strong style={{ color: message.color }}>{message.username}:</strong> {message.text}</p>
                    </div>
                ))}

                {/* Empty div to scroll to */}
                <div ref={lastMessageRef} />
            </ScrollArea>

            <Input
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="text-sm"
            />
        </div>
    );
}
