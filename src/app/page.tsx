"use client";
import { useEffect, useState } from "react";
import { useAudioStream } from "./useAudioStream";

export default function Page() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [recognition, setRecognition] = useState(false);

  const sendBlob = (blob: Blob) => {
    if (socket) {
      socket.send(blob);
    }
  };

  const { startStream, stopStream } = useAudioStream(sendBlob);
  const handleStartRecognition = () => {
    setRecognition(true);
    startStream();
  };
  const handleStopRecognition = () => {
    setRecognition(false);
    stopStream();
  };

  useEffect(() => {
    fetch("/api/socket", { cache: "no-store" }).finally(() => {
      const ws = new WebSocket("ws://localhost:3001");
      ws.onopen = () => {
        console.log("Connected to WebSocket server");
      };

      ws.onmessage = (event) => {
        setMessages((prevMessages) => [...prevMessages, event.data]);
      };

      ws.onclose = () => {
        console.log("Disconnected from WebSocket server");
      };

      setSocket(ws);
      return () => {
        ws.close();
      };
    });
  }, []);
  const sendMessage = () => {
    if (socket) {
      socket.send(input);
      setInput("");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-6 text-4xl font-extrabold">websocket-example</h1>
      <div>
        {messages.map((message, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <div key={index}>{message}</div>
        ))}
      </div>
      <div className="mt-6 mb-6 flex gap-2 items-center">
        <label
          htmlFor="default-input"
          className="block text-sm font-medium text-gray-900 dark:text-white"
        >
          Messages
        </label>
        <input
          type="text"
          id="default-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <button
          type="button"
          onClick={sendMessage}
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 disabled:opacity-75"
        >
          Send
        </button>
      </div>

      <button
        type="button"
        onClick={handleStartRecognition}
        disabled={recognition}
        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 disabled:opacity-75"
      >
        Start
      </button>
      <button
        type="button"
        onClick={handleStopRecognition}
        disabled={!recognition}
        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 disabled:opacity-75"
      >
        Stop
      </button>
    </main>
  );
}
