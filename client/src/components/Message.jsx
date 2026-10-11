import { useState } from "react";
function parseSteps(text) {
  const parts = text.split(/^\*\*(.+?)\*\*[ \t]*$/m);
  const steps = [];
  if (parts[0].trim()) steps.push({ title: null, body: parts[0].trim() });
  for (let i = 1; i < parts.length; i += 2) {
    steps.push({ title: parts[i], body: (parts[i + 1] ?? "").trim() });
  }
  return steps;
}
function Thinking({ text, answering }) {
  const [userOpen, setUserOpen] = useState(null);
  const open = userOpen ?? !answering;
  const steps = parseSteps(text);

  return (
    <div className="text-sm text-gray-500">
      <button
        onClick={() => setUserOpen(!open)}
        className="flex items-center gap-1.5 font-medium hover:text-gray-700"
      >
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full bg-gray-400 ${
            answering ? "" : "animate-pulse"
          }`}
        />
        {answering ? "Thought process" : "Thinking…"}
        <span className="text-xs">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
          <ol className="mt-3 space-y-3 border-l-2 border-gray-200 pl-4">
          {steps.map((s, i) => {
            const active = !answering && i === steps.length - 1;
            return (
              <li key={i}>
                {s.title && (
                  <p className={`font-medium ${active ? "animate-pulse text-gray-800" : "text-gray-600"}`}>
                    {s.title}
                  </p>
                )}
                {s.body && (
                  <p className="mt-0.5 whitespace-pre-wrap leading-relaxed">{s.body}</p>
                )}
              </li>
           );
          })}
        </ol>
      )}
    </div>
  );
}
export default function Message({ role, content, thinking }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-gray-100 px-4 py-2.5 leading-relaxed">
          {content}
        </p>
      </div>
    );
  }
 

  return (
      <div className="space-y-3">
      {thinking && <Thinking text={thinking} answering={!!content} />}
      {content ? (
        <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
          {content}
        </div>
      ) : (
        !thinking && <div className="text-gray-400">...</div>
      )}
    </div>
  );
}