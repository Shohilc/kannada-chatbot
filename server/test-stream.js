const res = await fetch("http://localhost:5000/api/chat/stream", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "ಬೆಂಗಳೂರಿನ ಬಗ್ಗೆ ಒಂದು ಸಣ್ಣ ಪ್ರಬಂಧ ಬರೆಯಿರಿ" }),
});

const decoder = new TextDecoder();
for await (const chunk of res.body) {
  process.stdout.write(decoder.decode(chunk, { stream: true }));
}