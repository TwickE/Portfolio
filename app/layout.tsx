import type { Metadata } from "next";
import "./globals.css";
import { Sora } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/context/ThemeProvider";
import QueryProvider from "@/context/QueryProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const sora = Sora({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-sora',
});

export const metadata: Metadata = {
    title: "Fred's Portfolio",
    description: "Welcome to my personal portfolio website! This site showcases my projects, skills, and experience as a Developer with a focus on Web Development.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${sora.variable} font-sora antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <QueryProvider>
                        {children}
                        <Toaster richColors />
                        <Analytics />
                        <SpeedInsights />
                    </QueryProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
