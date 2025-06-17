//* src/pages/owner/ExternalIntegration.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Button,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, CircularProgress
} from '@mui/material';
import { 
  Link, LinkOff, Sync, CheckCircle, Warning, Error
} from '@mui/icons-material';
import { externalService } from '../../services/externalService';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import OwnerHeader from '../../components/common/OwnerHeader';
import Navigation from '../../components/common/Navigation';

const ExternalIntegration = () => {
  const navigate = useNavigate();
  const { selectedStoreId, selectedStore } = useSelectedStore();
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
      reviewCount: 0,
      status: 'disconnected'
    },
    {
      id: 'KAKAO',
      name: '카카오맵',
      icon: '🟡',
      description: '카카오맵 리뷰',
      connected: false,
      lastSync: null,
      reviewCount: 0,
      status: 'disconnected'
    },
    {
      id: 'GOOGLE',
      name: '구글 비즈니스',
      icon: '🔵',
      description: '구글 맵, 비즈니스 프로필',
      connected: false,
      lastSync: null,
      reviewCount: 0,
      status: 'disconnected'
    },
    {
      id: 'HIORDER',
      name: '하이오더',
      icon: '🍽️',
      description: '하이오더 플랫폼',
      connected: true,
      lastSync: '1시간 전',
      reviewCount: 25,
      status: 'connected'
    }
  ];

  useEffect(() => {
    if (selectedStoreId) {
      loadPlatformStatus();
    } else {
      setPlatforms(platformsData);
      setLoading(false);
    }
  }, [selectedStoreId]);

  const loadPlatformStatus = async () => {
    try {
      setLoading(true);
      // TODO: 실제 API 호출로 플랫폼 연동 상태 조회
      // const response = await externalService.getPlatformStatus(selectedStoreId);
      // setPlatforms(response.data || platformsData);
      setPlatforms(platformsData);
    } catch (error) {
      console.error('플랫폼 상태 로드 실패:', error);
      setPlatforms(platformsData);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (platform) => {
    if (!selectedStoreId) {
      alert('매장을 선택해주세요.');
      return;
    }
    setConnectDialog({ open: true, platform });
    setCredentials({ username: '', password: '' });
  };

  const handleDisconnect = async (platformId) => {
    if (!selectedStoreId) {
      alert('매장을 선택해주세요.');
      return;
    }

    if (window.confirm('연동을 해제하시겠습니까?')) {
      try {
        // TODO: 실제 연동 해제 API 호출
        await externalService.disconnectPlatform(selectedStoreId, platformId);
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

      if (!credentials.username || !credentials.password) {
        alert('아이디와 비밀번호를 입력해주세요.');
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
      console.error('연동 실패:', error);
      alert('연동에 실패했습니다.');
    }
  };

  const handleSyncReviews = async () => {
    if (!selectedStoreId) {
      alert('매장을 선택해주세요.');
      return;
    }

    try {
      setSyncing(true);
      await externalService.syncReviews(selectedStoreId);
      alert('리뷰 동기화가 완료되었습니다.');
      loadPlatformStatus();
    } catch (error) {
      console.error('리뷰 동기화 실패:', error);
      alert('리뷰 동기화에 실패했습니다.');
    } finally {
      setSyncing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle sx={{ color: 'success.main' }} />;
      case 'error':
        return <Error sx={{ color: 'error.main' }} />;
      case 'warning':
        return <Warning sx={{ color: 'warning.main' }} />;
      default:
        return <LinkOff sx={{ color: 'text.secondary' }} />;
    }
  };

  const getStatusText = (connected, status) => {
    if (connected) {
      switch (status) {
        case 'connected':
          return '연동됨';
        case 'error':
          return '오류';
        case 'warning':
          return '주의';
        default:
          return '연동됨';
      }
    }
    return '미연동';
  };

  const getStatusColor = (connected, status) => {
    if (connected) {
      switch (status) {
        case 'connected':
          return 'success';
        case 'error':
          return 'error';
        case 'warning':
          return 'warning';
        default:
          return 'success';
      }
    }
    return 'default';
  };

  if (loading) {
    return (
      <Box className="mobile-container">
        <OwnerHeader 
          title="외부 플랫폼 연동"
          subtitle="로딩 중..."
          showStoreSelector={true}
          backPath="/owner/store-management"
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box className="mobile-container">
      <OwnerHeader 
        title="외부 플랫폼 연동"
        subtitle={selectedStore ? `${selectedStore.name} 연동 관리` : '매장을 선택해주세요'}
        showStoreSelector={true}
        backPath="/owner/store-management"
      />
      
      <Box className="content-area">
        {!selectedStoreId ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Link sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                연동을 관리할 매장을 선택해주세요
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                우측 상단에서 매장을 선택할 수 있습니다
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box>
            {/* 연동 상태 요약 */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  🔗 연동 현황
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {platforms.filter(p => p.connected).length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        연동된 플랫폼
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main">
                        {platforms.reduce((sum, p) => sum + p.reviewCount, 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        총 리뷰수
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Sync />}
                        onClick={handleSyncReviews}
                        disabled={syncing}
                        fullWidth
                      >
                        {syncing ? '동기화 중...' : '리뷰 동기화'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* 플랫폼 목록 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {platforms.map((platform) => (
                <Card key={platform.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Typography variant="h4">
                          {platform.icon}
                        </Typography>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {platform.name}
                            </Typography>
                            <Chip 
                              label={getStatusText(platform.connected, platform.status)}
                              color={getStatusColor(platform.connected, platform.status)}
                              size="small"
                              icon={getStatusIcon(platform.status)}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {platform.description}
                          </Typography>
                          {platform.connected && (
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                마지막 동기화: {platform.lastSync}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                                리뷰 {platform.reviewCount}개
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {platform.connected ? (
                          <Button
                            size="small"
                            color="error"
                            startIcon={<LinkOff />}
                            onClick={() => handleDisconnect(platform.id)}
                            disabled={platform.id === 'HIORDER'} // 하이오더는 연동 해제 불가
                          >
                            해제
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<Link />}
                            onClick={() => handleConnect(platform)}
                          >
                            연동
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* 연동 안내 */}
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  💡 연동 안내
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  • 외부 플랫폼 연동 시 해당 플랫폼의 계정 정보가 필요합니다
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  • 연동된 플랫폼의 리뷰는 자동으로 수집되어 AI 분석에 활용됩니다
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • 리뷰 동기화는 하루 1회 자동으로 실행되며, 수동으로도 가능합니다
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* 연동 설정 다이얼로그 */}
        <Dialog 
          open={connectDialog.open} 
          onClose={() => setConnectDialog({ open: false, platform: null })}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {connectDialog.platform?.name} 연동
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {connectDialog.platform?.name} 계정 정보를 입력해주세요.
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="아이디"
              fullWidth
              variant="outlined"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="비밀번호"
              type="password"
              fullWidth
              variant="outlined"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              * 계정 정보는 암호화되어 안전하게 저장됩니다
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConnectDialog({ open: false, platform: null })}>
              취소
            </Button>
            <Button onClick={handleConnectConfirm} variant="contained">
              연동하기
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      
      <Navigation />
    </Box>
  );
};

export default ExternalIntegration;