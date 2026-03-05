import "./globals.scss";
import StarsBackground from "./components/background/StarsBackground";
import { AuthProvider } from "app/context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          <StarsBackground />
          <div id="app-root">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
