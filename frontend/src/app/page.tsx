"use client";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const [roomId, setRoomId] = useState(searchParams.get("roomId") as string);
  const [name, setName] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!roomId || !name) {
      alert("Informe a sala e o seu nome");
    } else {
      window.location.href = `/rooms/${roomId}?name=${name}`;
    }
  }

  return (
    <main className="flex w-screen h-screen justify-center items-center flex-col">
      <h1 className="text-white font-bold text-5xl mb-3">Juntar-se a sala</h1>
      <form
        className="flex justify-center items-center flex-col"
        onSubmit={handleSubmit}
      >
        <label htmlFor="roomId" className="text-white font-bold">
          Sala:
        </label>
        <input
          type="text"
          name="roomId"
          className="mb-4 rounded-sm w-80 h-8 text-center p-3"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />

        <label htmlFor="name" className="text-white font-bold">
          Nome:
        </label>
        <input
          type="text"
          name="name"
          className="mb-4 rounded-sm w-80 h-8 text-center p-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
