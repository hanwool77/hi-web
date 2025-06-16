//* src/pages/owner/MenuManagement.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  TextField
} from '@mui/material';
import { ArrowBack, Add, Edit, Delete } from '@mui/icons-material';
import { storeApi } from '../../services/api';
import OwnerNavigation from '../../components/common/Navigation';

const MenuManagement = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
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
    loadMenus();
  }, [storeId]);

  const loadMenus = async () => {
    try {
      const response = await storeApi.get(`/api/stores/${storeId}/menus`);
      setMenus(response.data.data || []);
    } catch (error) {
      console.error('메뉴 목록 로드 실패:', error);
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
        await storeApi.put(`/api/stores/${storeId}/menus/${editingMenu.id}`, formData);
      } else {
        await storeApi.post(`/api/stores/${storeId}/menus`, formData);
      }
      setOpenDialog(false);
      loadMenus();
    } catch (error) {
      console.error('메뉴 저장 실패:', error);
    }
  };

  const handleDeleteMenu = async (menuId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await storeApi.delete(`/api/stores/${storeId}/menus/${menuId}`);
        loadMenus();
      } catch (error) {
        console.error('메뉴 삭제 실패:', error);
      }
    }
  };

  const formatPrice = (price) => {
    return price?.toLocaleString() + '원';
  };

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
          onClick={() => navigate(`/owner/stores/${storeId}/management`)}
          sx={{ cursor: 'pointer' }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            메뉴 관리
          </Typography>
        </Box>
      </Box>
      
      <Box className="content-area">
        {/* 메뉴 목록 */}
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

        {/* 메뉴 추가 FAB */}
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 80, right: 16 }}
          onClick={handleAddMenu}
        >
          <Add />
        </Fab>

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