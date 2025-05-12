import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import { ColorModeProvider } from './components/ui/color-mode'
import './index.css'
import App from './App.tsx'

// Define system with tokens
const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#E8F5FF' },
          100: { value: '#C9E5FF' },
          200: { value: '#96CBFF' },
          300: { value: '#63B1FF' },
          400: { value: '#3D97FF' },
          500: { value: '#1A7DF0' },
          600: { value: '#0E63D0' },
          700: { value: '#054BA0' },
          800: { value: '#023670' },
          900: { value: '#002040' },
        },
      },
    },
    semanticTokens: {
      colors: {
        "body.bg": { value: { base: 'gray.50', _dark: 'gray.900' } },
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <ColorModeProvider>
          <App />
        </ColorModeProvider>
      </ThemeProvider>
    </ChakraProvider>
  </StrictMode>,
)
