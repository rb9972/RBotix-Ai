// api/chat.js
export default async function handler(req, res) {
    const { message, history } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: "Your name is RBotix. Created by Rohit Bhosale. Respond in the user's language." },
                ...history,
                { role: "user", content: message }
            ]
        })
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });
}