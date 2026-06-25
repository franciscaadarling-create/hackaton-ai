import "./globals.css";

export const metadata = {
  title: "TicQuiz IA - Plataforma Educativa con IA",
  description: "Plataforma de aprendizaje con Groq AI",
  icons: [{ rel: "icon", url: "/logo/images.png" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
