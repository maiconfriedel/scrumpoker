"use client";
import { socket } from "@/socket";
import { FormEvent, useEffect, useState } from "react";

export default function Home({ params }: { params: { id: string } }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    socket.connect();

    socket.on("receivedMessage", (data: any) => {
      setMessages(data);
    });

    socket.on("previousMessage", (data: any) => {
      setMessages(data.filter((a: any) => a.roomId === params.id));
    });

    socket.on("connect", () => {
      socket.emit("joinRoom", { roomId: params.id });
    });

    return () => {
      socket.off("receivedMessage");
      socket.off("previousMessage");
    };
  }, [params]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(name, text);
    socket.emit("sendMessage", {
      message: text,
      author: name,
      roomId: params.id,
    });
  }

  return (
    <main className="flex w-screen h-screen justify-center items-center flex-col">
      <form
        className="flex  justify-center items-center flex-col"
        onSubmit={handleSubmit}
      >
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
        <label htmlFor="text" className="text-white font-bold">
          Texto:
        </label>
        <textarea
          name="text"
          className="mb-4 rounded-sm w-96 p-1"
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="text-white font-bold bg-black px-5 py-2 rounded-md hover:bg-zinc-800"
        >
          Enviar
        </button>
      </form>
      <div className="text-white mt-5">
        <h1 className="text-5xl font-bold mb-3">Mensagens</h1>
        <ul>
          {messages.map((message, i) => (
            <li key={i}>
              <b className="text-green-600">{message.author}:</b>{" "}
              {message.message}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
