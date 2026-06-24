import "./globals.css"; // Next.js crea este archivo por defecto

export const metadata = {
  title: "Hackathon Educativa IA",
  description: "Plataforma de aprendizaje con Groq",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900">
        <nav className="bg-blue-600 p-4 text-white font-bold shadow-md">
          Escuela Tech - Panel de IA
        </nav>
        {children}
      </body>
    </html>
  );
}