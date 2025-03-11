import { NextResponse } from 'next/server';
import { auth } from '@/auth';

// Especificar explícitamente el runtime para evitar problemas con TurboPack
export const runtime = 'nodejs';

export async function GET() {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json(
      { message: 'No autenticado' },
      { status: 401 }
    );
  }
  
  return NextResponse.json(
    { 
      user: session.user,
      expires: session.expires 
    },
    { status: 200 }
  );
} 