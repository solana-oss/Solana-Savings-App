import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SolanaProvider from './solana/SolanaProvider'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SolanaProvider>
        <App />
      </SolanaProvider>
    </QueryClientProvider>
  </StrictMode>
)
