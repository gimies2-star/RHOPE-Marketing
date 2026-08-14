import { NextResponse } from 'next/server';

// Rotas públicas — não exigem login. Tudo que não estiver aqui
// (Pipeline, Cadastro, Ads, APIs internas) fica protegido por senha.
const PUBLIC_PATHS = ['/diagnostico'];

function isPublic(pathname) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const user = process.env.CRM_BASIC_USER;
  const pass = process.env.CRM_BASIC_PASS;

  // Trava por padrão: sem as variáveis configuradas, ninguém entra
  // (evita expor o CRM publicamente por esquecimento de configuração).
  if (!user || !pass) {
    return new NextResponse(
      'Acesso ao CRM não configurado. Defina CRM_BASIC_USER e CRM_BASIC_PASS nas variáveis de ambiente.',
      { status: 503 }
    );
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Basic ')) {
    const decoded = atob(authHeader.slice(6));
    const sepIndex = decoded.indexOf(':');
    const reqUser = decoded.slice(0, sepIndex);
    const reqPass = decoded.slice(sepIndex + 1);
    if (reqUser === user && reqPass === pass) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Autenticação necessária.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Rhope CRM"' },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
