import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import ArticlePage from './pages/ArticlePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import NotFound from './pages/NotFound';
import AuthCallback from './pages/AuthCallback';
import AuthError from './pages/AuthError';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NewArticlePage from './pages/NewArticlePage';
import AdminPage from './pages/AdminPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/recherche" element={<SearchPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth/error" element={<AuthError />} />
          <Route path="/connexion" element={<LoginPage />} />
          <Route path="/inscription" element={<RegisterPage />} />
          <Route path="/nouvel-article" element={<NewArticlePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;