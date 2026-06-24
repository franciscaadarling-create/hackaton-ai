import "./globals.css";

export const metadata = {
  title: "EduQuiz AI - Plataforma Educativa con IA",
  description: "Plataforma de aprendizaje con Groq AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
