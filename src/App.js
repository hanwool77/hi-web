//* src/App.js
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

// Owner Pages (점주 화면만 우선 사용)
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
                {/* 공개 라우트 */}
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                
                {/* 모든 인증된 사용자는 점주 화면으로 이동 (임시) */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <OwnerMainPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 점주 페이지 */}
                <Route 
                  path="/owner" 
                  element={
                    <ProtectedRoute>
                      <OwnerMainPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/stores/:storeId/analytics" 
                  element={
                    <ProtectedRoute>
                      <StoreAnalytics />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/stores/:storeId/ai-feedback" 
                  element={
                    <ProtectedRoute>
                      <AIFeedback />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/stores/:storeId/ai-feedback/detail" 
                  element={
                    <ProtectedRoute>
                      <AIFeedbackDetail />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/stores/:storeId/action-plan" 
                  element={
                    <ProtectedRoute>
                      <ActionPlan />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/action-plan/list" 
                  element={
                    <ProtectedRoute>
                      <ActionPlanList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/stores/:storeId/management" 
                  element={
                    <ProtectedRoute>
                      <StoreManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/stores/:storeId/menu" 
                  element={
                    <ProtectedRoute>
                      <MenuManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/stores/:storeId/reviews" 
                  element={
                    <ProtectedRoute>
                      <ReviewManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/stores/:storeId/info" 
                  element={
                    <ProtectedRoute>
                      <StoreInfo />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/store/register" 
                  element={
                    <ProtectedRoute>
                      <StoreRegistration />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/stores" 
                  element={
                    <ProtectedRoute>
                      <StoresList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/external" 
                  element={
                    <ProtectedRoute>
                      <ExternalIntegration />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/subscription" 
                  element={
                    <ProtectedRoute>
                      <SubscriptionManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfileEdit />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/mypage" 
                  element={
                    <ProtectedRoute>
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