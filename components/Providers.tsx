"use client";

import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/context/LanguageContext";
import { SmoothScroll } from "@/components/SmoothScroll";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <LanguageProvider>
                <SmoothScroll>
                    {children}
                </SmoothScroll>
            </LanguageProvider>
        </ThemeProvider>
    );
}
