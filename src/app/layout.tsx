"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "../components/Providers";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={darkTheme}>
      <html lang="ko">
        <body className={inter.className}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ThemeProvider>
  );
}
