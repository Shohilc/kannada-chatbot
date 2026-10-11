 const res = await fetch("http://localhost:5000/api/chat/stream", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: [{ role: "user", content: process.argv[2] ?? "hello" }],
  }),
});

console.log("STATUS:", res.status);

const decoder = new TextDecoder();
let raw = "";
for await (const chunk of res.body) raw += decoder.decode(chunk, { stream: true });

const counts = {};
for (const m of raw.matchAll(/^event: (\w+)/gm)) {
  counts[m[1]] = (counts[m[1]] || 0) + 1;
}
console.log("EVENT COUNTS:", counts);