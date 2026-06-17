import "./globals.css";

export const metadata = {
  title: "Linky — Tu página de links",
  description: "Crea tu página de links personalizada y compártela con el mundo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
