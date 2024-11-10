"use client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

export default function Chatbox() {
    const [messages, setMessages] = useState([
        { id: 1, username: "Anonymous Deer", text: "Anyone wanna play" },
        { id: 2, username: "Landon", text: "Yes, let's play anonymous deer" },
        { id: 3, username: "Anonymous Dragonfly", text: "Gimme link" },
        { id: 4, username: "Me", text: "Hi anonymous swan" },
        { id: 5, username: "Ruisairpods", text: "Anyone else hear that ominous bell tolling? No? Just me?" },
        { id: 6, username: "Anonymous Sparrow", text: "https://setwithfriends.com/room/grotesque-magnificent-eggs" },
        { id: 7, username: "Jerk", text: "Hey" },
        { id: 8, username: "Anonymous Jellyfish", text: "Anyone wanna play?" },
        { id: 9, username: "Anonymous Turkey", text: "T" },
        { id: 10, username: "hairymanfeet432", text: "Hairmanfeet" },
    ]);
    const [newMessage, setNewMessage] = useState("");

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && newMessage.trim() !== "") {
            const newMessageObject = {
                id: messages.length + 1,
                username: "Me", // You could make this dynamic if needed
                text: newMessage,
            };
            setMessages([...messages, newMessageObject]);
            setNewMessage(""); // Clear the input field
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
                className="w-[300 px] mt-2"
            />
        </div>
    );
}
