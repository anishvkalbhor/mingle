// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   try {
//     const { message } = (await request.json()) as { message: string };

//     if (!message) {
//       return NextResponse.json(
//         { error: "Message is required" },
//         { status: 400 }
//       );
//     }

//     const apiKey = process.env.GEMINI_API_KEY;
//     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent?key=${apiKey}`;

//     const payload = {
//       contents: [{ role: "user", parts: [{ text: message }] }],
//     };

//     const response = await fetch(apiUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       throw new Error(`Gemini API call failed: ${response.status}`);
//     }

//     const result = (await response.json()) as any;

//     const reply =
//       result.candidates &&
//       result.candidates[0]?.content?.parts &&
//       result.candidates[0].content.parts[0]?.text
//         ? result.candidates[0].content.parts[0].text
//         : "I'm not sure how to respond to that. Could you try rephrasing?";

//     return NextResponse.json({ reply }, { status: 200 });
//   } catch (error) {
//     console.error("Error in Gemini chatbot API:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
