import { useState, useRef, useEffect } from "react";
import Message from "./components/Message";
import ChatInput from "./components/ChatInput";
import { streamChat } from "./api";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const handleSend = async (text) => {
  const userMsg = { id: crypto.randomUUID(), role: "user", content: text };
  const botId = crypto.randomUUID();
  const history = [...messages, userMsg];

  setMessages([...history, { id: botId, role: "bot", content: "", thinking: "" }]);
  setLoading(true);

  const updateBot = (fn) =>
    setMessages((prev) => prev.map((m) => (m.id === botId ? fn(m) : m)));

  try {
    await streamChat(
      history
        .filter((m) => !m.error && m.content)
        .map(({ role, content }) => ({ role, content })),
      {
        onThought: (chunk) =>
          updateBot((m) => ({ ...m, thinking: m.thinking + chunk })),
        onAnswer: (chunk) =>
          updateBot((m) => ({ ...m, content: m.content + chunk })),
        onError: (msg) =>
          updateBot((m) => ({ ...m, content: msg, error: true })),
      }
    );
  } catch {
    updateBot((m) => ({
      ...m,
      content: "Could not reach the server. Please try again.",
      error: true,
    }));
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex h-dvh flex-col bg-white text-gray-900">
      <header className="border-b border-gray-100 px-6 py-4">
        <h1 className="text-base font-semibold">ಕನ್ನಡ AI · Kannada AI</h1>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
          {messages.length === 0 && (
            <div className="pt-24 text-center text-gray-500">
              <p className="text-2xl font-medium text-gray-800">ನಮಸ್ಕಾರ 👋</p>
              <p className="mt-2">Ask me anything in Kannada, English, or both.</p>
            </div>
          )}
          {messages.map((m) => (
           <Message key={m.id} role={m.role} content={m.content} thinking={m.thinking} />
          ))}
          <div ref={bottomRef} />
        </div>
      </main>

      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
}