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
import MainPage from './pages/customer/MainPage';
import StoreDetail from './pages/customer/StoreDetail';
import ReviewWrite from './pages/customer/ReviewWrite';
import ReviewList from './pages/customer/ReviewList';
import MyPage from './pages/customer/MyPage';
import Profile from './pages/customer/Profile';
import PreferenceSettings from './pages/customer/PreferenceSettings';

// Owner Pages  
import OwnerMainPage from './pages/owner/OwnerMainPage';
import StoreAnalytics from './pages/owner/StoreAnalytics';
import AIFeedback from './pages/owner/AIFeedback';
import ActionPlan from './pages/owner/ActionPlan';
import StoreManagement from './pages/owner/StoreManagement';
import StoreRegistration from './pages/owner/StoreRegistration';
import StoresList from './pages/owner/StoresList';
import ExternalIntegration from './pages/owner/ExternalIntegration';
import OwnerMyPage from './pages/owner/OwnerMyPage';

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
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SelectedStoreProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* 공개 페이지 (로그인하지 않은 사용자만) */}
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  } 
                />
                
                {/* 고객 페이지 (로그인 필요) */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <MainPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/stores/:storeId" 
                  element={
                    <ProtectedRoute>
                      <StoreDetail />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/stores/:storeId/review/write" 
                  element={
                    <ProtectedRoute>
                      <ReviewWrite />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/stores/:storeId/reviews" 
                  element={
                    <ProtectedRoute>
                      <ReviewList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/mypage" 
                  element={
                    <ProtectedRoute>
                      <MyPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/preferences" 
                  element={
                    <ProtectedRoute>
                      <PreferenceSettings />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 점주 페이지 (점주 권한 필요) */}
                <Route 
                  path="/owner" 
                  element={
                    <ProtectedRoute requireOwner={true}>
                      <OwnerMainPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/stores/:storeId/analytics" 
                  element={
                    <ProtectedRoute requireOwner={true}>
                      <StoreAnalytics />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/stores/:storeId/ai-feedback" 
                  element={
                    <ProtectedRoute requireOwner={true}>
                      <AIFeedback />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/stores/:storeId/action-plan" 
                  element={
                    <ProtectedRoute requireOwner={true}>
                      <ActionPlan />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/stores/:storeId/management" 
                  element={
                    <ProtectedRoute requireOwner={true}>
                      <StoreManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/store/register" 
                  element={
                    <ProtectedRoute requireOwner={true}>
                      <StoreRegistration />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/stores" 
                  element={
                    <ProtectedRoute requireOwner={true}>
                      <StoresList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/external" 
                  element={
                    <ProtectedRoute requireOwner={true}>
                      <ExternalIntegration />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/mypage" 
                  element={
                    <ProtectedRoute requireOwner={true}>
                      <OwnerMyPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 페이지 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </SelectedStoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;