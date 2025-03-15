// servicio para la API de OpenAI
import { OpenAI } from "openai";

// Configuramos la API de OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

export async function generateResponseAI(prompt: string) {
    try {
        // Llamar a la API de OpenAI
        const completion = await openai.chat.completions.create({
            messages: [
              { role: "system", content: "Eres un experto en arquitectura de software que crea diagramas claros y detallados basados en requisitos del sistema." },
              { role: "user", content: prompt }
            ],
            model: "gpt-4",
          });
  
          // Retornar la respuesta
          const response = completion.choices[0].message.content || '';
          return response;
    } catch (error) {
        console.error('Error al generar la respuesta:', error);
        throw error;
    }
}