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
          <body className={inter.className}>
            <Provider store={store}>{children}</Provider>
          </body>
        </html>
      </ThemeProvider>
    </>
  );
}
