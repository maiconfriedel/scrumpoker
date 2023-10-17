"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    window.location.href = `/rooms/${roomId}`;
  }

  return (
    <main className="flex w-screen h-screen justify-center items-center flex-col">
      <h1 className="text-white font-bold text-5xl mb-3">Juntar-se a sala: </h1>
      <form
        className="flex justify-center items-center flex-col"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="name"
          className="mb-4 rounded-sm w-80 h-8 text-center p-3"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />

        <button
          type="submit"
          className="text-white font-bold bg-black px-5 py-2 rounded-md hover:bg-zinc-800"
        >
          Juntar-se
        </button>
      </form>
    </main>
  );
}
