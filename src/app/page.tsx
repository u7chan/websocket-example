"use client";
import { useEffect, useState } from "react";
import { useAudioStream } from "./useAudioStream";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const handleSendBlob = (blob: Blob) => {
    if (socket) {
      socket.send(blob);
    }
  };

  const { activeStream, handleStartAudioStream, handleStopAudioStream } = useAudioStream({
    onBlobStream: handleSendBlob,
  });

  useEffect(() => {
    fetch("/api/socket", { cache: "no-store" }).finally(() => {
      const ws = new WebSocket("ws://localhost:3001");
      ws.onopen = () => {
        console.log("Connected to WebSocket server");
        setLoading(false);
      };

      ws.onmessage = (event) => {
        setMessages((prevMessages) => [...prevMessages, event.data]);
      };

      ws.onclose = () => {
        console.log("Disconnected from WebSocket server");
        setLoading(true);
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
      {loading ? (
        <Loading />
      ) : (
        <>
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
            <Button label="Send" onClick={sendMessage} />
          </div>
          <Button label="Start" disabled={activeStream} onClick={handleStartAudioStream} />
          <Button label="Stop" disabled={!activeStream} onClick={handleStopAudioStream} />
        </>
      )}
    </main>
  );
}

const Button = ({
  label,
  disabled,
  onClick,
}: { label: string; disabled?: boolean; onClick?: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 disabled:opacity-75"
  >
    {label}
  </button>
);

const Loading = () => (
  <div role="status">
    <svg
      aria-hidden="true"
      className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
    <span className="sr-only">Loading...</span>
  </div>
);
