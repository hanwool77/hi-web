//* src/pages/owner/ExternalIntegration.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Button,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, CircularProgress, Menu, MenuItem
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
  const [syncMenuAnchor, setSyncMenuAnchor] = useState(null);

  const getPlatformsData = (storeId) => [
    {
      id: 'NAVER',
      name: '네이버 플레이스',
      icon: '🟢',
      description: '네이버 지도, 플레이스 리뷰',
      connected: false,
      lastSync: null,
      reviewCount: 0,
      status: 'disconnected',
      externalStoreId: storeId
    },
    {
      id: 'KAKAO',
      name: '카카오맵',
      icon: '🟡',
      description: '카카오맵 리뷰',
      connected: true,
      lastSync: null, // 하드코딩 제거
      reviewCount: 0, // 하드코딩 제거
      status: 'connected',
      externalStoreId: storeId
    },
    {
      id: 'GOOGLE',
      name: '구글 비즈니스',
      icon: '🔵',
      description: '구글 맵, 비즈니스 프로필',
      connected: false,
      lastSync: null,
      reviewCount: 0,
      status: 'disconnected',
      externalStoreId: storeId
    },
    {
      id: 'HIORDER',
      name: '하이오더',
      icon: '🍽️',
      description: '하이오더 플랫폼',
      connected: true,
      lastSync: null, // 하드코딩 제거
      reviewCount: 0, // 하드코딩 제거
      status: 'connected',
      externalStoreId: storeId
    }
  ];

  // 동기화 시간을 상대적 시간으로 변환하는 함수
  const getRelativeTime = (syncTime) => {
    if (!syncTime) return null;
    
    const now = new Date();
    const sync = new Date(syncTime);
    const diffInMinutes = Math.floor((now - sync) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}일 전`;
  };

  useEffect(() => {
    if (selectedStoreId) {
      loadPlatformStatus();
    } else {
      setPlatforms(getPlatformsData(null));
      setLoading(false);
    }
  }, [selectedStoreId]);

  const loadPlatformStatus = async () => {
    try {
      setLoading(true);
      // TODO: 실제 API 호출로 플랫폼 연동 상태 조회
      // const response = await externalService.getPlatformStatus(selectedStoreId);
      // setPlatforms(response.data || getPlatformsData(selectedStoreId));
      setPlatforms(getPlatformsData(selectedStoreId));
    } catch (error) {
      console.error('플랫폼 상태 로드 실패:', error);
      setPlatforms(getPlatformsData(selectedStoreId));
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

  // 개별 플랫폼 리뷰 동기화 - 수정된 부분
  const handleSyncReviews = async (platform) => {
    if (!selectedStoreId) {
      alert('매장을 선택해주세요.');
      return;
    }

    if (!platform.connected) {
      alert('연동되지 않은 플랫폼입니다.');
      return;
    }

    try {
      setSyncing(true);
      const response = await externalService.syncReviews(
        selectedStoreId, 
        platform.id, 
        platform.externalStoreId
      );

      // 동기화 성공 후 플랫폼 정보 업데이트
      if (response.success && response.syncedCount !== undefined) {
        const currentTime = new Date().toISOString();
        
        setPlatforms(prevPlatforms => 
          prevPlatforms.map(p => 
            p.id === platform.id 
              ? { 
                  ...p, 
                  reviewCount: p.reviewCount + response.syncedCount, // 기존 리뷰 수에 동기화된 리뷰 수 추가
                  lastSync: currentTime // 현재 시간으로 마지막 동기화 시간 업데이트
                }
              : p
          )
        );
        
        alert(`${platform.name} 리뷰 동기화가 완료되었습니다. (${response.syncedCount}개 동기화)`);
      } else {
        alert(`${platform.name} 리뷰 동기화가 완료되었습니다.`);
      }
    } catch (error) {
      console.error('리뷰 동기화 실패:', error);
      alert('리뷰 동기화에 실패했습니다.');
    } finally {
      setSyncing(false);
      setSyncMenuAnchor(null);
    }
  };

  // 모든 플랫폼 리뷰 동기화 - 수정된 부분
  const handleSyncAllReviews = async () => {
    if (!selectedStoreId) {
      alert('매장을 선택해주세요.');
      return;
    }

    const connectedPlatforms = platforms.filter(p => p.connected);
    if (connectedPlatforms.length === 0) {
      alert('연동된 플랫폼이 없습니다.');
      return;
    }

    try {
      setSyncing(true);
      
      // 각 연동된 플랫폼별로 개별 동기화 실행
      let totalSyncedCount = 0;
      const currentTime = new Date().toISOString();
      
      for (const platform of connectedPlatforms) {
        try {
          const response = await externalService.syncReviews(
            selectedStoreId, 
            platform.id, 
            platform.externalStoreId
          );
          
          if (response.success && response.syncedCount !== undefined) {
            totalSyncedCount += response.syncedCount;
            
            // 각 플랫폼별 정보 업데이트
            setPlatforms(prevPlatforms => 
              prevPlatforms.map(p => 
                p.id === platform.id 
                  ? { 
                      ...p, 
                      reviewCount: p.reviewCount + response.syncedCount,
                      lastSync: currentTime
                    }
                  : p
              )
            );
          }
        } catch (platformError) {
          console.error(`${platform.name} 동기화 실패:`, platformError);
        }
      }
      
      alert(`모든 플랫폼 리뷰 동기화가 완료되었습니다. (총 ${totalSyncedCount}개 동기화)`);
    } catch (error) {
      console.error('전체 리뷰 동기화 실패:', error);
      alert('전체 리뷰 동기화에 실패했습니다.');
    } finally {
      setSyncing(false);
      setSyncMenuAnchor(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle />;
      case 'warning': return <Warning />;
      case 'error': return <Error />;
      default: return <LinkOff />;
    }
  };

  if (loading) {
    return (
      <Box className="mobile-container">
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
        subtitle={selectedStore?.name || '매장을 선택해주세요'}
        onBack={() => navigate('/owner')} 
      />
      
      <Box className="content-area">
        {/* 동기화 버튼 */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={syncing ? <CircularProgress size={20} /> : <Sync />}
            onClick={(e) => setSyncMenuAnchor(e.currentTarget)}
            disabled={syncing || !selectedStoreId}
            size="small"
          >
            {syncing ? '동기화 중...' : '리뷰 동기화'}
          </Button>
        </Box>

        {/* 동기화 메뉴 */}
        <Menu
          anchorEl={syncMenuAnchor}
          open={Boolean(syncMenuAnchor)}
          onClose={() => setSyncMenuAnchor(null)}
        >
          <MenuItem onClick={handleSyncAllReviews}>
            전체 플랫폼 동기화
          </MenuItem>
          {platforms.filter(p => p.connected).map((platform) => (
            <MenuItem 
              key={platform.id}
              onClick={() => handleSyncReviews(platform)}
            >
              {platform.name} 동기화
            </MenuItem>
          ))}
        </Menu>

        {/* 플랫폼 목록 */}
        {platforms.map((platform) => (
          <Card key={platform.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ mr: 1 }}>
                  {platform.icon}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {platform.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {platform.description}
                  </Typography>
                </Box>
                <Chip
                  icon={getStatusIcon(platform.status)}
                  label={platform.connected ? '연동됨' : '연동 안됨'}
                  color={getStatusColor(platform.status)}
                  size="small"
                />
              </Box>

              {platform.connected && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    리뷰 수: {platform.reviewCount.toLocaleString()}개
                  </Typography>
                  {platform.lastSync && (
                    <Typography variant="body2" color="text.secondary">
                      마지막 동기화: {getRelativeTime(platform.lastSync)}
                    </Typography>
                  )}
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {platform.connected ? (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<Sync />}
                      onClick={() => handleSyncReviews(platform)}
                      disabled={syncing}
                      size="small"
                    >
                      동기화
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<LinkOff />}
                      onClick={() => handleDisconnect(platform.id)}
                      size="small"
                    >
                      연동 해제
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<Link />}
                    onClick={() => handleConnect(platform)}
                    size="small"
                  >
                    연동하기
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* 연동 다이얼로그 */}
      <Dialog
        open={connectDialog.open}
        onClose={() => setConnectDialog({ open: false, platform: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {connectDialog.platform?.name} 계정 연동
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {connectDialog.platform?.name} 계정 정보를 입력해주세요.
          </Typography>
          <TextField
            fullWidth
            label="아이디"
            value={credentials.username}
            onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="비밀번호"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            margin="normal"
          />
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

      <Navigation currentPath="/external-integration" />
    </Box>
  );
};

export default ExternalIntegration;