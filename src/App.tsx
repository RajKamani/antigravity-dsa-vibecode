import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from './components/common/Toast';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { ProblemsPage } from './pages/ProblemsPage';
import { AddProblemPage } from './pages/AddProblemPage';
import { ProblemDetailPage } from './pages/ProblemDetailPage';
import { ReSolvePage } from './pages/ReSolvePage';
import { PatternsPage } from './pages/PatternsPage';
import { ReadinessPage } from './pages/ReadinessPage';
import { DailyPlanPage } from './pages/DailyPlanPage';
import { MockInterviewPage } from './pages/MockInterviewPage';
import { SystemDesignPage } from './pages/SystemDesignPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { BenchmarkPage } from './pages/BenchmarkPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/" element={<AuthGuard><Layout /></AuthGuard>}>
            <Route index element={<DashboardPage />} />
            <Route path="problems" element={<ProblemsPage />} />
            <Route path="problems/:id" element={<ProblemDetailPage />} />
            <Route path="resolve/:id" element={<ReSolvePage />} />
            <Route path="add" element={<AddProblemPage />} />
            <Route path="daily-plan" element={<DailyPlanPage />} />
            <Route path="flashcards" element={<FlashcardsPage />} />
            <Route path="benchmark" element={<BenchmarkPage />} />
            <Route path="patterns" element={<PatternsPage />} />
            <Route path="readiness" element={<ReadinessPage />} />
            <Route path="mock" element={<MockInterviewPage />} />
            <Route path="system-design" element={<SystemDesignPage />} />
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
