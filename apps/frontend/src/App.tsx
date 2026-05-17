import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';
import { AppRoutes } from './routes/AppRoutes';
import { useEffect } from 'react';
import { useThemeStore } from './store/useThemeStore';

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  // Initialize theme on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <Toaster theme={isDarkMode ? 'dark' : 'light'} position="top-right" />
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
