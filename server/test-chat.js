const messages = [
  "naale office ge hogbeku, traffic jaasti irutte antha gottu. enu maadli?",
  "ನನಗೆ ಬೆಂಗಳೂರಿನಲ್ಲಿ ಒಳ್ಳೆಯ ಬಿಸಿಬೇಳೆ ಬಾತ್ ಎಲ್ಲಿ ಸಿಗುತ್ತೆ?",
  "Explain what an API is in simple words",
  "nanna laptop slow agide, yenu maadbeku?",
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (const message of messages) {
  await sleep(1000); // Wait 1 second between messages
  const res = await fetch("http://localhost:5000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  console.log("USER:", message);
  console.log("BOT:", data.reply ?? data);
  console.log("STATUS:", res.status);
  console.log("-----");
}