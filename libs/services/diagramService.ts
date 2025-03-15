import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ISystemRequirement, DiagramContent } from '../models/systemRequirement';
import { getSystemRequirementById, updateSystemRequirementById } from '@/app/api/utils/systemRequirement';
import { generateResponseAI } from '@/app/api/utils/openAI';


/**
 * Servicio para manejar la generación de diagramas utilizando OpenAI
 */
export class DiagramService {
  /**
   * Genera diagramas basados en los requisitos del sistema
   * @param requirementId ID del requisito para generar diagrama
   * @returns El requisito actualizado con URLs de diagramas
   */
  static async generateDiagrams(
    requirementId: string,
    userId: string
  ): Promise<ISystemRequirement | null> {
    try {
      // 1. Encontrar el requisito por ID y verificar pertenencia al usuario
      const requirement = await getSystemRequirementById(requirementId, userId);

      if (!requirement) {
        throw new Error('Requisito no encontrado o no autorizado');
      }

      // 2. Actualizar el estado a "generating"
      requirement.status = 'generating';
      await updateSystemRequirementById(requirementId, requirement);

      try {
        // 3. Generar el prompt para OpenAI basado en los requisitos
        const prompt = this.buildPrompt(requirement);

        // 4. Generar la respuesta con OpenAI
        const response = await generateResponseAI(prompt);
        
        
        // 5. Extraer diferentes diagramas de la respuesta
        const { diagramUrls, diagrams } = await this.processResponse(response, requirementId);
        
        // 6. Actualizar el requisito con los diagramas, contenido completo y estado
        requirement.diagramUrls = diagramUrls;
        requirement.diagrams = diagrams;
        requirement.designDocument = response; // Guardar el documento completo
        requirement.status = 'completed';
        

        return await updateSystemRequirementById(requirementId, requirement);
      } catch (error) {
        // Si hay un error en la generación, actualizar el estado a "failed"
        requirement.status = 'failed';
        await updateSystemRequirementById(requirementId, requirement);
        throw error;
      }
    } catch (error) {
      console.error('Error al generar diagramas:', error);
      throw error;
    }
  }

  /**
   * Construye el prompt para OpenAI basado en los requisitos del sistema
   */
  private static buildPrompt(requirement: ISystemRequirement): string {
    const prompt = `
Genera un documento de diseño de sistema completo para el siguiente proyecto:

NOMBRE DEL PROYECTO: ${requirement.name}

DESCRIPCIÓN: ${requirement.description}

TIPO DE APLICACIÓN: ${requirement.applicationType}

REQUISITOS FUNCIONALES:
${requirement.functionalRequirements?.map((req, index) => `${index + 1}. ${req}`).join('\n')}

REQUISITOS NO FUNCIONALES:
- Escalabilidad: ${requirement.nonFunctionalRequirements?.scalability}
- Disponibilidad: ${requirement.nonFunctionalRequirements?.availability}
- Seguridad: ${requirement.nonFunctionalRequirements?.security}
- Rendimiento: ${requirement.nonFunctionalRequirements?.performance}

PREFERENCIAS TECNOLÓGICAS:
- Lenguaje Backend: ${requirement.techPreferences?.backendLanguage}
- Frameworks: ${requirement.techPreferences?.frameworks?.join(', ')}
- Bases de datos: ${requirement.techPreferences?.databases?.join(', ')}
- Arquitectura: ${requirement.techPreferences?.architecture}

CONTEXTO ADICIONAL: ${requirement.additionalContext}

---

Estructura tu respuesta siguiendo este framework de diseño de sistemas:

1. ENTENDER EL PROBLEMA Y REQUISITOS
   - Clarificación del problema: Explica el problema central que el sistema resolverá.
   - Identificación de usuarios y casos de uso: Define los tipos de usuarios y sus principales interacciones.
   - Análisis de requisitos funcionales y no funcionales: Analiza los requisitos proporcionados.
   - Suposiciones y restricciones: Identifica limitaciones y suposiciones importantes.

2. ARQUITECTURA DE ALTO NIVEL
   - Componentes principales del sistema: Identifica y describe los componentes clave.
   - Patrones de comunicación: Explica cómo se comunicarán los componentes.
   - DIAGRAMA DE ARQUITECTURA GENERAL: Crea un diagrama de arquitectura usando la sintaxis Mermaid.

3. DISEÑO DETALLADO Y TECNOLOGÍAS
   - Modelado de datos: Describe las principales entidades y sus relaciones.
   - DIAGRAMA DE BASE DE DATOS: Crea un diagrama ER usando la sintaxis Mermaid.
   - Diseño de APIs: Describe los principales endpoints y su funcionalidad.
   - Stack tecnológico detallado: Justifica la elección de tecnologías específicas.
   - Seguridad: Explica las medidas de seguridad implementadas.
   - Escalabilidad y rendimiento: Describe cómo el sistema manejará el crecimiento.
   - DIAGRAMA DE SECUENCIA: Crea un diagrama para una operación crítica usando Mermaid.

4. TRADE-OFFS Y ALTERNATIVAS
   - Justificación de decisiones arquitectónicas: Explica por qué elegiste esta arquitectura.
   - Alternativas consideradas: Menciona otras opciones y por qué no fueron seleccionadas.
   - Estrategias de resiliencia: Describe cómo el sistema manejará fallos.

5. VALIDACIÓN DEL DISEÑO
   - Estrategia de pruebas: Describe cómo se probará el sistema.
   - Monitoreo y logging: Explica cómo se monitoreará el sistema en producción.
   - Recuperación ante fallos: Describe estrategias de backup y recuperación.

INSTRUCCIONES IMPORTANTES:
1. Para cada diagrama, proporciona:
   - Un título claro y descriptivo
   - Una descripción breve de lo que muestra
   - El diagrama en formato Mermaid (dentro de bloques de código con la sintaxis correcta)
   - Una explicación detallada de los componentes

2. Asegúrate de que los diagramas sean claros, legibles y muestren correctamente las relaciones.

3. Separa cada sección principal con tres guiones (---) para facilitar el procesamiento.

4. Utiliza las tecnologías especificadas en las preferencias tecnológicas.

5. Sé específico y detallado en tus explicaciones, evitando generalidades.
`;
    return prompt;
  }

  /**
   * Procesa la respuesta de OpenAI y extrae los diagramas
   * Guarda cada diagrama como un archivo Markdown en la carpeta uploads
   * @returns Objeto con las URLs y el contenido estructurado de los diagramas generados
   */
  private static async processResponse(
    response: string,
    requirementId: string
  ): Promise<{ diagramUrls: string[], diagrams: DiagramContent[] }> {
    // Dividir la respuesta por separadores
    const sections = response.split('---').filter(section => section.trim() !== '');
    
    // Crear la carpeta para este requisito si no existe
    const requirementFolder = path.join(process.cwd(), 'uploads', requirementId);
    if (!fs.existsSync(requirementFolder)) {
      fs.mkdirSync(requirementFolder, { recursive: true });
    }
    
    const diagramUrls: string[] = [];
    const diagrams: DiagramContent[] = [];
    
    // Procesar cada sección como un diagrama diferente
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      
      // Extraer contenido estructurado del diagrama
      const diagramContent = this.extractDiagramContent(section);
      
      // Generar nombre único para el archivo
      const fileName = `diagram_${i + 1}_${uuidv4().slice(0, 8)}.md`;
      const filePath = path.join(requirementFolder, fileName);
      
      // Guardar el contenido del diagrama en un archivo
      fs.writeFileSync(filePath, section);
      
      // Crear la URL relativa para acceder al diagrama
      const fileUrl = `/uploads/${requirementId}/${fileName}`;
      diagramUrls.push(fileUrl);
      
      // Almacenar el contenido estructurado con la URL
      diagrams.push({
        ...diagramContent,
        url: fileUrl
      });
    }
    
    return { diagramUrls, diagrams };
  }

  /**
   * Extrae el contenido estructurado de un diagrama
   * @param section Texto de la sección del diagrama
   * @returns Objeto con el contenido estructurado
   */
  private static extractDiagramContent(section: string): DiagramContent {
    // Implementar lógica para extraer título, descripción, diagrama y explicación
    const lines = section.split('\n');
    let title = '';
    let description = '';
    let diagramText = '';
    let explanation = '';
    let inDiagram = false;
    let inExplanation = false;
    const descriptionLines: string[] = [];
    const explanationLines: string[] = [];
    
    // Extraer título (primera línea no vacía)
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim()) {
        title = lines[i].trim();
        break;
      }
    }
    
    // Procesar el resto del contenido
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Saltar líneas vacías y el título
      if (!line || line === title) continue;
      
      // Detectar inicio y fin de bloque de código (diagrama)
      if (line.startsWith('```')) {
        inDiagram = !inDiagram;
        diagramText += line + '\n';
        continue;
      }
      
      // Detectar sección de explicación
      if (line.startsWith('## Explicación') || line.startsWith('### Explicación')) {
        inExplanation = true;
        continue;
      }
      
      // Asignar línea a la sección correspondiente
      if (inDiagram) {
        diagramText += line + '\n';
      } else if (inExplanation) {
        explanationLines.push(line);
      } else if (!diagramText) {
        // Si aún no tenemos diagrama, es parte de la descripción
        descriptionLines.push(line);
      } else {
        // Si ya tenemos diagrama pero no estamos en explicación, también es parte de la explicación
        explanationLines.push(line);
      }
    }
    
    // Unir las líneas en texto
    description = descriptionLines.join('\n').trim();
    explanation = explanationLines.join('\n').trim();
    
    // Si no se encontró una explicación explícita, usar todo el texto después del diagrama
    if (!explanation && descriptionLines.length > 0) {
      const descriptionParts = description.split('\n\n');
      if (descriptionParts.length > 1) {
        // Usar la primera parte como descripción y el resto como explicación
        description = descriptionParts[0].trim();
        explanation = descriptionParts.slice(1).join('\n\n').trim();
      }
    }
    
    // Asegurarse de que tenemos al menos valores vacíos
    return {
      title: title || 'Diagrama sin título',
      description: description || 'Sin descripción',
      diagramText: diagramText || '',
      explanation: explanation || 'Sin explicación detallada',
      url: '' // Se asignará después
    };
  }
}
