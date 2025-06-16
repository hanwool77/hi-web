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
import { ArrowBack, Add, Edit, Delete, Restaurant } from '@mui/icons-material';
import { storeApi } from '../../services/api';
import { useSelectedStore } from '../../contexts/SelectedStoreContext';
import OwnerNavigation from '../../components/common/Navigation';

const MenuManagement = () => {
  const navigate = useNavigate();
  const { selectedStoreId } = useSelectedStore();
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
      if (editingMenu) {
        await storeApi.put(`/api/stores/${selectedStoreId}/menus/${editingMenu.id}`, formData);
      } else {
        await storeApi.post(`/api/stores/${selectedStoreId}/menus`, formData);
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
      {/* 헤더 */}
      <Box sx={{ 
        p: 2, 
        bgcolor: '#2c3e50', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <ArrowBack 
          onClick={() => navigate('/owner/management')}
          sx={{ cursor: 'pointer' }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            메뉴 관리
          </Typography>
        </Box>
      </Box>
      
      <Box className="content-area">
        {menus.length === 0 ? (
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
        {menus.length > 0 && (
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
              fullWidth
              label="메뉴명"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              margin="normal"
            />
            <TextField
              fullWidth
              label="가격"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              margin="normal"
            />
            <TextField
              fullWidth
              label="설명"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              margin="normal"
            />
            <TextField
              fullWidth
              label="카테고리"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>취소</Button>
            <Button onClick={handleSaveMenu} variant="contained">저장</Button>
          </DialogActions>
        </Dialog>
      </Box>
      
      <OwnerNavigation />
    </Box>
  );
};

export default MenuManagement;