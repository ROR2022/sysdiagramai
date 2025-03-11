import { NextResponse } from 'next/server';
import { auth } from '@/auth';

// Especificar explícitamente el runtime para evitar problemas con TurboPack
export const runtime = "nodejs";

// Interfaz para los datos recibidos del formulario
interface FormData {
  projectName: string;
  systemType: string;
  expectedUsers: string;
  functionalRequirements: string;
  nonFunctionalRequirements: string;
}

export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Obtener los datos del formulario
    const formData: FormData = await request.json();
    
    // Validación básica
    if (!formData.projectName || !formData.functionalRequirements) {
      return NextResponse.json(
        { error: 'Se requiere un nombre de proyecto y requerimientos funcionales' },
        { status: 400 }
      );
    }

    // En una implementación real, aquí enviarías los datos a OpenAI
    // Por ahora, simularemos la respuesta con datos estáticos
    
    // Simulando un poco de procesamiento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generar ID único para el diseño
    const designId = `design_${Date.now()}`;
    
    // En producción, guardarías estos resultados en la base de datos
    const designResult = {
      designId,
      message: 'Diagrama generado exitosamente',
    };
    
    return NextResponse.json(designResult);
    
    /* NOTA: 
       Para integrar realmente con OpenAI, necesitarías:
       1. Instalar el paquete de OpenAI: npm install openai
       2. Configurar una clave de API en .env.local
       3. Implementar código como el siguiente:

    import OpenAI from 'openai';

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `
      Genera un diagrama de arquitectura y base de datos para:
      Nombre del Proyecto: ${formData.projectName}
      Tipo de Sistema: ${formData.systemType}
      Usuarios Esperados: ${formData.expectedUsers}
      Requerimientos Funcionales: ${formData.functionalRequirements}
      Requerimientos No Funcionales: ${formData.nonFunctionalRequirements || "N/A"}
      
      Formato deseado:
      1. Un diagrama de arquitectura en formato mermaid
      2. Un diagrama de base de datos en formato mermaid
      3. Una explicación detallada del diseño propuesto
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Eres un experto en diseño de sistemas y arquitectura de software. Tu trabajo es generar diagramas claros y útiles en formato mermaid."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.7,
    });

    const result = response.choices[0].message.content;
    
    // Procesar la respuesta para extraer los diagramas
    // Guardar en MongoDB
    // ...
    */
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 