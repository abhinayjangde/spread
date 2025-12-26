"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("dark")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem("spread_theme") as Theme | null
        if (savedTheme) {
            setThemeState(savedTheme)
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setThemeState("dark")
        } else {
            setThemeState("light")
        }
    }, [])

    useEffect(() => {
        if (!mounted) return

        // Update document class and save preference
        const root = document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(theme)
        localStorage.setItem("spread_theme", theme)
    }, [theme, mounted])

    const toggleTheme = () => {
        setThemeState((prev) => (prev === "light" ? "dark" : "light"))
    }

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
    }

    // Prevent flash of wrong theme
    if (!mounted) {
        return null
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
