import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { message } = await request.json() as { message: string };

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('GEMINI_API_KEY is missing in environment variables.');
            return NextResponse.json({ error: "Gemini API key is missing on the server." }, { status: 500 });
        }

        // Try pro model first, fallback to flash if it fails
        const tryGemini = async (model: string) => {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const payload = {
                contents: [{ role: "user", parts: [{ text: message }] }]
            };
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Gemini API error (${model}):`, errorText);
                throw new Error(`Gemini API call failed: ${response.status}`);
            }
            return response.json() as Promise<any>;
        };

        let result;
        try {
            result = await tryGemini('gemini-2.0-pro');
        } catch (err) {
            console.warn('Falling back to gemini-2.0-flash...');
            result = await tryGemini('gemini-2.0-flash');
        }

        const reply =
            result.candidates &&
            result.candidates[0]?.content?.parts &&
            result.candidates[0].content.parts[0]?.text
                ? result.candidates[0].content.parts[0].text
                : "I'm not sure how to respond to that. Could you try rephrasing?";

        return NextResponse.json({ reply }, { status: 200 });
    } catch (error) {
        console.error("Error in Gemini chatbot API:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
} 