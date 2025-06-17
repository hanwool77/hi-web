//* src/pages/owner/MenuManagement.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Grid,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, Restaurant } from '@mui/icons-material';
import { storeApi } from '../../services/api';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import OwnerHeader from '../../components/common/OwnerHeader';
import Navigation from '../../components/common/Navigation';

const MenuManagement = () => {
  const navigate = useNavigate();
  const { selectedStoreId, selectedStore } = useSelectedStore();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    if (selectedStoreId) {
      loadMenus();
    } else {
      setMenus([]);
      setLoading(false);
    }
  }, [selectedStoreId]);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const response = await storeApi.get(`/api/stores/${selectedStoreId}/menus`);
      setMenus(response.data.data || []);
    } catch (error) {
      console.error('메뉴 목록 로드 실패:', error);
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenu = () => {
    if (!selectedStoreId) {
      alert('매장을 선택해주세요.');
      return;
    }
    setEditingMenu(null);
    setFormData({ name: '', price: '', description: '', category: '' });
    setOpenDialog(true);
  };

  const handleEditMenu = (menu) => {
    setEditingMenu(menu);
    setFormData({
      name: menu.name,
      price: menu.price.toString(),
      description: menu.description,
      category: menu.category
    });
    setOpenDialog(true);
  };

  const handleSaveMenu = async () => {
    try {
      if (!selectedStoreId) {
        alert('매장을 선택해주세요.');
        return;
      }

      const menuData = {
        ...formData,
        price: parseInt(formData.price)
      };

      if (editingMenu) {
        await storeApi.put(`/api/stores/${selectedStoreId}/menus/${editingMenu.id}`, menuData);
      } else {
        await storeApi.post(`/api/stores/${selectedStoreId}/menus`, menuData);
      }
      setOpenDialog(false);
      loadMenus();
    } catch (error) {
      console.error('메뉴 저장 실패:', error);
      alert('메뉴 저장에 실패했습니다.');
    }
  };

  const handleDeleteMenu = async (menuId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await storeApi.delete(`/api/stores/${selectedStoreId}/menus/${menuId}`);
        loadMenus();
      } catch (error) {
        console.error('메뉴 삭제 실패:', error);
        alert('메뉴 삭제에 실패했습니다.');
      }
    }
  };

  const formatPrice = (price) => {
    return price?.toLocaleString() + '원';
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <Box className="mobile-container">
        <OwnerHeader 
          title="메뉴 관리"
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
        title="메뉴 관리"
        subtitle={selectedStore ? `${selectedStore.name} 메뉴` : '매장을 선택해주세요'}
        showStoreSelector={true}
        backPath="/owner/store-management"
      />
      
      <Box className="content-area">
        {!selectedStoreId ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Restaurant sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                메뉴를 관리할 매장을 선택해주세요
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                우측 상단에서 매장을 선택할 수 있습니다
              </Typography>
            </CardContent>
          </Card>
        ) : menus.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Restaurant sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                등록된 메뉴가 없습니다
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                첫 번째 메뉴를 추가해보세요
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<Add />}
                onClick={handleAddMenu}
              >
                메뉴 추가
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {menus.map((menu) => (
              <Grid item xs={12} sm={6} key={menu.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {menu.name}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                      {formatPrice(menu.price)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {menu.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      카테고리: {menu.category}
                    </Typography>
                    
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button 
                        size="small" 
                        startIcon={<Edit />}
                        onClick={() => handleEditMenu(menu)}
                      >
                        수정
                      </Button>
                      <Button 
                        size="small" 
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDeleteMenu(menu.id)}
                      >
                        삭제
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* 메뉴 추가 FAB - 메뉴가 있을 때만 표시 */}
        {menus.length > 0 && selectedStoreId && (
          <Fab
            color="primary"
            sx={{ position: 'fixed', bottom: 80, right: 16 }}
            onClick={handleAddMenu}
          >
            <Add />
          </Fab>
        )}

        {/* 메뉴 추가/편집 다이얼로그 */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
          <DialogTitle>
            {editingMenu ? '메뉴 수정' : '메뉴 추가'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="메뉴명"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="가격"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.price}
              onChange={(e) => handleFormChange('price', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="설명"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="카테고리"
              fullWidth
              variant="outlined"
              value={formData.category}
              onChange={(e) => handleFormChange('category', e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>취소</Button>
            <Button onClick={handleSaveMenu} variant="contained">
              {editingMenu ? '수정' : '추가'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      
      <Navigation />
    </Box>
  );
};

export default MenuManagement;