import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import './index.css'
import App from './App.tsx'

// Define theme colors and configuration
const theme = extendTheme({
  colors: {
    brand: {
      50: '#E8F5FF',
      100: '#C9E5FF',
      200: '#96CBFF',
      300: '#63B1FF',
      400: '#3D97FF',
      500: '#1A7DF0',
      600: '#0E63D0',
      700: '#054BA0',
      800: '#023670',
      900: '#002040',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      }
    }
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
      },
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </StrictMode>,
)
