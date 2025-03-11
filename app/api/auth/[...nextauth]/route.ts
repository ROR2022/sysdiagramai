import { handlers } from "@/auth"

// Especificar explícitamente el runtime para evitar problemas con TurboPack
export const runtime = "nodejs"

export const { GET, POST } = handlers