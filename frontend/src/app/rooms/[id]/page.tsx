"use client";
import Card from "@/components/card";
import { socket } from "@/socket";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [name, setName] = useState(searchParams.get("name") as string);
  const [messages, setMessages] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!searchParams.get("name")) {
      return router.push(`/?roomId=${params.id}`);
    }

    setName(searchParams.get("name") as string);

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

    socket.on("visibleChanged", (data: any) => {
      setVisible(data.visible);
    });

    return () => {
      socket.off("receivedMessage");
      socket.off("previousMessage");
    };
  }, [params, searchParams, router]);

  function handleSubmit(message: string) {
    socket.emit("sendMessage", {
      message: message,
      author: name,
      roomId: params.id,
    });
  }

  function handleSetVisible() {
    socket.emit("setVisible", {
      visible: !visible,
      roomId: params.id,
    });
  }

  return (
    <main className="flex w-screen h-screen items-center justify-center flex-col">
      <div className="flex flex-row gap-2 flex-wrap">
        <Card points={1} onClick={() => handleSubmit("1")} />
        <Card points={2} onClick={() => handleSubmit("2")} />
        <Card points={3} onClick={() => handleSubmit("3")} />
        <Card points={5} onClick={() => handleSubmit("5")} />
        <Card points={8} onClick={() => handleSubmit("8")} />
        <Card points={13} onClick={() => handleSubmit("13")} />
        <Card points={21} onClick={() => handleSubmit("21")} />
      </div>
      <div className="text-white mt-5">
        <button onClick={() => handleSetVisible()}>Exibir Mensagens</button>
        {visible && (
          <ul>
            {messages.map((message, i) => (
              <li key={i}>
                <b className="text-green-600">{message.author}:</b>{" "}
                {message.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
