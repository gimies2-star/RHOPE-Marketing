import { ThemeProvider } from '../components/ThemeContext';

export const metadata = {
  title: 'Rhope — Sistema Interno',
  description: 'Pipeline, Ads e Cadastro — Rhope Assessoria Digital',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
