const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
  baseURL: "https://api.groq.com/openai/v1",
});

async function main() {
  try {
    const response = await openai.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: "Hello" }],
    });
    console.log("Success:", response.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
main();
