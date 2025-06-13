import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Button,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid
} from '@mui/material';
import { 
  ArrowBack, Link, LinkOff, Sync, CheckCircle, Warning
} from '@mui/icons-material';
import { externalService } from '../../services/externalService';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import OwnerNavigation from '../../components/common/OwnerNavigation';

const ExternalIntegration = () => {
  const navigate = useNavigate();
  const { selectedStoreId } = useSelectedStore();
  const [platforms, setPlatforms] = useState([]);
  const [connectDialog, setConnectDialog] = useState({ open: false, platform: null });
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  const platformsData = [
    {
      id: 'NAVER',
      name: '네이버 플레이스',
      icon: '🟢',
      description: '네이버 지도, 플레이스 리뷰',
      connected: false,
      lastSync: null,
      reviewCount: 0
    },
    {
      id: 'KAKAO',
      name: '카카오맵',
      icon: '🟡',
      description: '카카오맵 리뷰',
      connected: false,
      lastSync: null,
      reviewCount: 0
    },
    {
      id: 'GOOGLE',
      name: '구글 비즈니스',
      icon: '🔵',
      description: '구글 맵, 비즈니스 프로필',
      connected: false,
      lastSync: null,
      reviewCount: 0
    },
    {
      id: 'HIORDER',
      name: '하이오더',
      icon: '🍽️',
      description: '하이오더 플랫폼',
      connected: true,
      lastSync: '1시간 전',
      reviewCount: 25
    }
  ];

  useEffect(() => {
    loadPlatformStatus();
  }, []);

  const loadPlatformStatus = async () => {
    try {
      setLoading(true);
      // TODO: 실제 API 호출로 플랫폼 연동 상태 조회
      setPlatforms(platformsData);
    } catch (error) {
      console.error('플랫폼 상태 로드 실패:', error);
      setPlatforms(platformsData);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (platformId) => {
    const platform = platforms.find(p => p.id === platformId);
    setConnectDialog({ open: true, platform });
  };

  const handleDisconnect = async (platformId) => {
    if (window.confirm('연동을 해제하시겠습니까?')) {
      try {
        // TODO: 실제 연동 해제 API 호출
        console.log('Disconnect platform:', platformId);
        alert('연동이 해제되었습니다.');
        loadPlatformStatus();
      } catch (error) {
        console.error('연동 해제 실패:', error);
        alert('연동 해제에 실패했습니다.');
      }
    }
  };

  const handleConnectConfirm = async () => {
    try {
      if (!selectedStoreId) {
        alert('매장을 선택해주세요.');
        return;
      }

      await externalService.connectPlatform(
        selectedStoreId,
        connectDialog.platform.id,
        credentials
      );
      
      alert('연동이 완료되었습니다.');
      setConnectDialog({ open: false, platform: null });
      setCredentials({ username: '', password: '' });
      loadPlatformStatus();
    } catch (error) {
      console.error('플랫폼 연동 실패:', error);
      alert('연동에 실패했습니다.');
    }
  };

  const handleSyncAll = async () => {
    setSyncing(true);
    try {
      const connectedPlatforms = platforms.filter(p => p.connected);
      
      for (const platform of connectedPlatforms) {
        if (platform.id !== 'HIORDER') {
          await externalService.syncReviews(
            selectedStoreId,
            platform.id,
            'external-store-id' // TODO: 실제 외부 매장 ID
          );
        }
      }
      
      alert('동기화가 완료되었습니다.');
      loadPlatformStatus();
    } catch (error) {
      console.error('동기화 실패:', error);
      alert('동기화에 실패했습니다.');
    } finally {
      setSyncing(false);
    }
  };

  const connectedPlatforms = platforms.filter(p => p.connected);
  const totalReviews = connectedPlatforms.reduce((sum, p) => sum + p.reviewCount, 0);

  return (
    <Box className="mobile-container">
      <Box sx={{ p: 2, bgcolor: '#2c3e50', color: 'white', display: 'flex', alignItems: 'center' }}>
        <ArrowBack sx={{ mr: 1, cursor: 'pointer' }} onClick={() => navigate(-1)} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          외부 플랫폼 연동
        </Typography>
      </Box>

      <Box className="content-area">
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          외부 플랫폼과 연동하여 더 많은 리뷰를 수집하고 분석하세요.
        </Typography>

        {/* 플랫폼 목록 */}
        {platforms.map((platform) => (
          <Card key={platform.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ mr: 2 }}>
                  {platform.icon}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {platform.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {platform.description}
                  </Typography>
                </Box>
                <Chip 
                  label={platform.connected ? '연동됨' : '미연동'}
                  color={platform.connected ? 'success' : 'default'}
                  size="small"
                />
              </Box>

              {platform.connected ? (
                <>
                  <Typography variant="body2" color="success.main" sx={{ mb: 1 }}>
                    ✅ 연동 완료 • 최근 수집: {platform.lastSync}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    수집된 리뷰: {platform.reviewCount?.toLocaleString()}개
                  </Typography>
                  {platform.id !== 'HIORDER' && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<LinkOff />}
                      onClick={() => handleDisconnect(platform.id)}
                      size="small"
                    >
                      해제
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Typography variant="body2" color="warning.main" sx={{ mb: 2 }}>
                    ⚠️ 연동하여 더 많은 리뷰를 수집하세요
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Link />}
                    onClick={() => handleConnect(platform.id)}
                    size="small"
                  >
                    연동
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}

        {/* 수집 통계 */}
        {connectedPlatforms.length > 0 && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                📊 수집 통계
              </Typography>
              {connectedPlatforms.map((platform) => (
                <Typography key={platform.id} variant="body2" sx={{ mb: 0.5 }}>
                  • {platform.name}: {platform.reviewCount?.toLocaleString()}개 리뷰
                </Typography>
              ))}
              <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                • 총 수집: {totalReviews?.toLocaleString()}개 리뷰
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • 마지막 수집: 1시간 전
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* 수동 동기화 */}
        {connectedPlatforms.length > 0 && (
          <Button
            fullWidth
            variant="contained"
            startIcon={<Sync />}
            onClick={handleSyncAll}
            disabled={syncing}
            sx={{ mb: 2 }}
          >
            {syncing ? '동기화 중...' : '🔄 지금 동기화하기'}
          </Button>
        )}

        {/* 연동 다이얼로그 */}
        <Dialog 
          open={connectDialog.open} 
          onClose={() => setConnectDialog({ open: false, platform: null })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {connectDialog.platform?.name} 연동
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {connectDialog.platform?.name} 계정 정보를 입력해주세요.
            </Typography>
            <TextField
              fullWidth
              label="아이디/이메일"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              type="password"
              label="비밀번호"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConnectDialog({ open: false, platform: null })}>
              취소
            </Button>
            <Button variant="contained" onClick={handleConnectConfirm}>
              연동하기
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <OwnerNavigation />
    </Box>
  );
};

export default ExternalIntegration;