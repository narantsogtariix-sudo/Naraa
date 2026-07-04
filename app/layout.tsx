import type {Metadata} from 'next';
import { Inter, Anton } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

const anton = Anton({
  subsets: ['latin'],
  variable: '--font-display',
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Нараа | Тренди Хувцас, Гутал & TOONHUB цуглуулга',
  description: 'Хямд бөгөөд чанартай хувцас, гутал болон TOONHUB 3D фигурин цуглуулгыг хамгийн хямдаар захиалаарай.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="mn" className={`${inter.variable} ${anton.variable}`}>
      <body suppressHydrationWarning className="bg-[#121212] text-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
