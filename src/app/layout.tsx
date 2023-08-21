'use client';

import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { Provider } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { store } from '../redux/store';
import { CssBaseline } from '@mui/material';
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#000000',
          color: '#FFFFFF',
        },
      },
    },
  },
});

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <html lang="ko">
          <head>
            <title>스파이폴 온라인: 가입 없이 무료로 스파이폴 즐기기! - play-spyfall</title>
            <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1473493437844810"
              crossOrigin="anonymous"></script>
            <meta name="naver-site-verification" content="6ee3bb7b2745a9d34ef088afda8f091c6d6f14b2" />
          </head>
          <body className={inter.className}>
            <Provider store={store}>{children}</Provider>
          </body>
        </html>
      </ThemeProvider>
    </>
  );
}
