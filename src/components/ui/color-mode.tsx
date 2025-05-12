'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useTheme } from 'next-themes'

type ColorModeContextType = {
    colorMode: string
    toggleColorMode: () => void
}

const ColorModeContext = createContext<ColorModeContextType>({
    colorMode: 'light',
    toggleColorMode: () => { }
})

export const useColorMode = () => useContext(ColorModeContext)

export const ColorModeProvider = ({ children }: { children: ReactNode }) => {
    const { theme, setTheme } = useTheme()

    const toggleColorMode = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
        <ColorModeContext.Provider
            value={{
                colorMode: theme || 'light',
                toggleColorMode
            }}
        >
            {children}
        </ColorModeContext.Provider>
    )
} 