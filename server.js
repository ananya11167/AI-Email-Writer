const express = require("express");
const dotenv = require("dotenv");
const Groq = require("groq-sdk");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.use(express.static("public"));
app.use(express.json());

app.post("/generate", async (req, res) => {

    try {

        const {
            sender,
            recipient,
            subject,
            purpose,
            tone,
            points
        } = req.body;

        const prompt = `
You are an expert business communication assistant.

Generate a professional email using the following information.

Sender:
${sender}

Recipient:
${recipient}

Subject:
${subject}

Purpose:
${purpose}

Tone:
${tone}

Key Points:
${points}

Requirements:

- Start with:

Subject: ${subject}

Dear ${recipient},

- Write a natural, well-structured email.
- Use the requested tone throughout.
- Include every key point naturally.
- Keep the email concise and professional.
- End exactly with:

Best regards,

${sender}

Return ONLY the email in Markdown format.
Do NOT use placeholders like [Your Name] or [Recipient Name].
`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.1-8b-instant"
        });

        res.json({
            success: true,
            message: completion.choices[0].message.content
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to generate email."
        });

    }

});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
