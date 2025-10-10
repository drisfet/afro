import { AppProps } from 'next/app'
import { MedusaProvider } from 'medusa-react'
import { QueryClient } from '@tanstack/react-query'
import { medusaClient } from '@/lib/medusa-client'
import '@/styles/globals.css'

const queryClient = new QueryClient()

function App({ Component, pageProps }: AppProps) {
  return (
    <MedusaProvider
      queryClientProviderProps={{ client: queryClient }}
      baseUrl={process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}
    >
      <Component {...pageProps} />
    </MedusaProvider>
  )
}

export default App
