//* src/components/common/OwnerHeader.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl,
  CircularProgress,
  Chip
} from '@mui/material';
import { ArrowBack, Store } from '@mui/icons-material';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';

const OwnerHeader = ({ 
  title, 
  subtitle, 
  onBack, 
  showStoreSelector = true,
  backPath = '/owner'
}) => {
  const navigate = useNavigate();
  const { 
    selectedStoreId, 
    selectedStore, 
    stores, 
    loading, 
    error, 
    selectStore 
  } = useSelectedStore();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(backPath);
    }
  };

  const handleStoreChange = (event) => {
    const storeId = event.target.value;
    selectStore(storeId);
  };

  return (
    <Box sx={{ 
      p: 2, 
      bgcolor: '#2c3e50', 
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* 좌측: 뒤로가기 + 타이틀 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
        <ArrowBack 
          onClick={handleBack}
          sx={{ cursor: 'pointer' }}
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      {/* 우측: 매장 선택 드롭다운 */}
      {showStoreSelector && (
        <Box sx={{ minWidth: 130, maxWidth: 160 }}>
          {loading ? (
            <CircularProgress size={20} sx={{ color: 'white' }} />
          ) : error ? (
            <Chip 
              label="오류" 
              size="small" 
              sx={{ bgcolor: '#e74c3c', color: 'white', fontSize: '0.7rem' }}
            />
          ) : stores.length === 0 ? (
            <Chip 
              label="매장없음" 
              size="small" 
              sx={{ bgcolor: '#95a5a6', color: 'white', fontSize: '0.7rem' }}
            />
          ) : (
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <Select
                value={selectedStoreId || ''}
                onChange={handleStoreChange}
                displayEmpty
                renderValue={(value) => {
                  if (!value) return '매장 선택';
                  const store = stores.find(s => s.storeId === value);
                  return store ? store.storeName : '매장 선택';
                }}
                sx={{
                  color: 'white',
                  fontSize: '0.8rem',
                  height: 32,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'white',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <Typography sx={{ fontSize: '0.8rem' }}>매장을 선택해주세요</Typography>
                </MenuItem>
                {stores.map((store) => (
                  <MenuItem key={store.storeId} value={store.storeId}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Store sx={{ fontSize: 16, color: '#2c3e50' }} />
                      <Typography sx={{ fontSize: '0.8rem' }}>
                        {store.storeName}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      )}
    </Box>
  );
};

export default OwnerHeader;