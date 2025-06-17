//* src/App.js - AIFeedbackDetail 라우트 추가
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { SelectedStoreProvider } from './contexts/SelectedStoreContext';

// 보호 컴포넌트
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Owner Pages
import OwnerMainPage from './pages/owner/OwnerMainPage';
import StoreAnalytics from './pages/owner/StoreAnalytics';
import AIFeedback from './pages/owner/AIFeedback';
import AIFeedbackDetail from './pages/owner/AIFeedbackDetail'; // 새로 추가
import ActionPlan from './pages/owner/ActionPlan';
import ActionPlanList from './pages/owner/ActionPlanList';
import StoreManagement from './pages/owner/StoreManagement';
import MenuManagement from './pages/owner/MenuManagement';
import ReviewManagement from './pages/owner/ReviewManagement';
import ExternalIntegration from './pages/owner/ExternalIntegration';
import StoreInfo from './pages/owner/StoreInfo';
import StoreRegistration from './pages/owner/StoreRegistration';
import StoresList from './pages/owner/StoresList';
import SubscriptionManagement from './pages/owner/SubscriptionManagement';
import ProfileEdit from './pages/owner/ProfileEdit';
import OwnerMyPage from './pages/owner/OwnerMyPage';

import MainPage from './pages/customer/MainPage';

import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50',
    },
    secondary: {
      main: '#e74c3c',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SelectedStoreProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />

              {/* Owner Protected Routes */}
              <Route path="/owner" element={
                <ProtectedRoute requiredRole="OWNER">
                  <OwnerMainPage />
                </ProtectedRoute>
              } />
              
              <Route path="/owner/analytics/:storeId" element={
                <ProtectedRoute requiredRole="OWNER">
                  <StoreAnalytics />
                </ProtectedRoute>
              } />
              
              <Route path="/owner/ai-feedback" element={
                <ProtectedRoute requiredRole="OWNER">
                  <AIFeedback />
                </ProtectedRoute>
              } />
              
              {/* 새로 추가된 AI 피드백 상세 라우트 */}
              <Route path="/owner/ai-feedback/detail" element={
                <ProtectedRoute requiredRole="OWNER">
                  <AIFeedbackDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/owner/action-plan" element={
                <ProtectedRoute requiredRole="OWNER">
                  <ActionPlan />
                </ProtectedRoute>
              } />
              
              <Route path="/owner/action-plan/list" element={
                <ProtectedRoute requiredRole="OWNER">
                  <ActionPlanList />
                </ProtectedRoute>
              } />
              
              <Route path="/owner/management" element={
                <ProtectedRoute requiredRole="OWNER">
                  <StoreManagement />
                </ProtectedRoute>
              } />
              
              <Route path="/owner/menu" element={
                <ProtectedRoute requiredRole="OWNER">
                  <MenuManagement />
                </ProtectedRoute>
              } />
              
              <Route path="/owner/reviews" element={
                <ProtectedRoute requiredRole="OWNER">
                  <ReviewManagement />
                </ProtectedRoute>
              } />
              
              <Route path="/owner/external" element={
                <ProtectedRoute requiredRole="OWNER">
                  <ExternalIntegration />
                </ProtectedRoute>
              } />
              
              <Route path="/owner/store/:storeId/info" element={
                <ProtectedRoute requiredRole="OWNER">
                  <StoreInfo />
                </ProtectedRoute>
              } />
              
              <Route path="/owner/store/register" element={
                <ProtectedRoute requiredRole="OWNER">
                  <StoreRegistration />
                </ProtectedRoute>
              } />
              
              <Route path="/owner/stores" element={
                <ProtectedRoute requiredRole="OWNER">
                  <StoresList />
                </ProtectedRoute>
              } />
              
              <Route path="/owner/subscription" element={
                <ProtectedRoute requiredRole="OWNER">
                  <SubscriptionManagement />
                </ProtectedRoute>
              } />
              
              <Route path="/owner/profile" element={
                <ProtectedRoute requiredRole="OWNER">
                  <ProfileEdit />
                </ProtectedRoute>
              } />
              
              <Route path="/owner/mypage" element={
                <ProtectedRoute requiredRole="OWNER">
                  <OwnerMyPage />
                </ProtectedRoute>
              } />

              {/* Default redirect */}
              {/* Customer Main Route */}
              <Route path="/" element={
                <ProtectedRoute>
                  <MainPage />
                </ProtectedRoute>
              } />

              {/* 404 처리 */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </SelectedStoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;