"use client";
import { socket } from "@/socket";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Home({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [name, setName] = useState(searchParams.get("name") as string);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!searchParams.get("name")) {
      return router.push(`/?roomId=${params.id}`);
    }

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
  }, [params, searchParams, router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setText("");
    socket.emit("sendMessage", {
      message: text,
      author: name,
      roomId: params.id,
    });
  }

  return (
    <main className="flex w-screen h-screen items-center flex-col">
      <form
        className="flex justify-center items-center flex-col mt-5"
        onSubmit={handleSubmit}
      >
        <label htmlFor="name" className="text-white font-bold">
          Nome:
        </label>
        <input
          type="text"
          name="name"
          className="mb-4 rounded-md w-80 h-8 text-center p-3 disabled:bg-zinc-600 disabled:text-gray-400"
          value={name}
          disabled
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
