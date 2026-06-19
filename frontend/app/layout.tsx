import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 antialiased min-h-screen transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Global Navigation Wrapper */}
          <Navbar />

          {/* Main Content Layout Block */}
          <div className="md:pl-64 w-full min-h-screen">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}