//* src/App.js - AIFeedbackDetail 라우트 feedbackId 파라미터 추가
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
import AIFeedbackDetail from './pages/owner/AIFeedbackDetail';
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

// Customer Pages  
import MainPage from './pages/customer/MainPage';
import StoreDetail from './pages/customer/StoreDetail';
import Profile from './pages/customer/Profile';
// import CustomerMyPage from './pages/customer/CustomerMyPage'; // 파일이 존재하지 않음
import PreferenceSettings from './pages/customer/PreferenceSettings';
import MyPage from './pages/customer/MyPage';

// Common Pages
// import NotFound from './pages/NotFound'; // 파일이 존재하지 않음

// MUI 테마 설정
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
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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
              <Route path="/" element={<Navigate to="/login" replace />} />
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

              {/* Customer Routes - requiredRole을 "USER"로 수정 */}
              <Route path="/customer/main" element={
                <ProtectedRoute requiredRole="USER">
                  <MainPage />
                </ProtectedRoute>
              } />
              <Route path="/customer" element={
                <ProtectedRoute requiredRole="USER">
                  <MainPage />
                </ProtectedRoute>
              } />
              <Route path="/customer/mypage" element={
                <ProtectedRoute requiredRole="USER">
                  <MyPage />
                </ProtectedRoute>
              } />
              <Route path="/customer/profile" element={
                <ProtectedRoute requiredRole="USER">
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/customer/store/:storeId" element={
                <ProtectedRoute requiredRole="USER">
                  <StoreDetail />
                </ProtectedRoute>
              } />
              <Route path="/customer/preferences" element={
                <ProtectedRoute requiredRole="USER">
                  <PreferenceSettings />
                </ProtectedRoute>
              } />

              {/* Owner Routes */}
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
              {/* feedbackId 파라미터 추가 */}
              <Route path="/owner/ai-feedback/detail/:feedbackId" element={
                <ProtectedRoute requiredRole="OWNER">
                  <AIFeedbackDetail />
                </ProtectedRoute>
              } />
              {/* 기존 라우트도 유지 (하위 호환성) */}
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
              <Route path="/owner/store-management" element={
                <ProtectedRoute requiredRole="OWNER">
                  <StoreManagement />
                </ProtectedRoute>
              } />
              <Route path="/owner/store-management/:storeId" element={
                <ProtectedRoute requiredRole="OWNER">
                  <StoreManagement />
                </ProtectedRoute>
              } />
              <Route path="/owner/menu-management" element={
                <ProtectedRoute requiredRole="OWNER">
                  <MenuManagement />
                </ProtectedRoute>
              } />
              <Route path="/owner/review-management" element={
                <ProtectedRoute requiredRole="OWNER">
                  <ReviewManagement />
                </ProtectedRoute>
              } />
              <Route path="/owner/external-integration" element={
                <ProtectedRoute requiredRole="OWNER">
                  <ExternalIntegration />
                </ProtectedRoute>
              } />
              <Route path="/owner/store-info" element={
                <ProtectedRoute requiredRole="OWNER">
                  <StoreInfo />
                </ProtectedRoute>
              } />
              <Route path="/owner/store-registration" element={
                <ProtectedRoute requiredRole="OWNER">
                  <StoreRegistration />
                </ProtectedRoute>
              } />
              <Route path="/owner/stores-list" element={
                <ProtectedRoute requiredRole="OWNER">
                  <StoresList />
                </ProtectedRoute>
              } />
              <Route path="/owner/subscription" element={
                <ProtectedRoute requiredRole="OWNER">
                  <SubscriptionManagement />
                </ProtectedRoute>
              } />
              <Route path="/owner/ProfileEdit" element={
                <ProtectedRoute requiredRole="OWNER">
                  <ProfileEdit />
                </ProtectedRoute>
              } />
              <Route path="/owner/mypage" element={
                <ProtectedRoute requiredRole="OWNER">
                  <OwnerMyPage />
                </ProtectedRoute>
              } />

              {/* 404 Page - NotFound 컴포넌트가 존재하지 않아 주석처리
              <Route path="*" element={<NotFound />} />
              */}
              <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
          </Router>
        </SelectedStoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;