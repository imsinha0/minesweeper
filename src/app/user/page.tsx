"use client"
import { useUser } from "../../context/UserContext";

export default function UserPage() {

  const username = useUser().username; // Destructure to access username

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Welcome {username}</h1>
    </div>
  );
}
