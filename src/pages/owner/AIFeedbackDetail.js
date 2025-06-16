//* src/pages/owner/AIFeedbackDetail.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  TextField,
  Alert 
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { analyticsService } from '../../services/analyticsService';

const AIFeedbackDetail = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedbacks, setSelectedFeedbacks] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadAIFeedbacks();
  }, [storeId]);

  const loadAIFeedbacks = async () => {
    try {
      const response = await analyticsService.getAIFeedback(storeId);
      setFeedbacks(response.data || []);
    } catch (error) {
      console.error('AI 피드백 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSelect = (feedbackId) => {
    setSelectedFeedbacks(prev => 
      prev.includes(feedbackId) 
        ? prev.filter(id => id !== feedbackId)
        : [...prev, feedbackId]
    );
  };

  const handleSaveActionPlan = async () => {
    try {
      const response = await analyticsService.saveActionPlan({
        feedbackIds: selectedFeedbacks,
        note: note
      });
      setSaveMessage('실행 계획이 저장되었습니다.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('실행 계획 저장 실패:', error);
      setSaveMessage('저장에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <Box className="mobile-container">
        <Typography>로딩 중...</Typography>
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
          onClick={() => navigate(`/owner/stores/${storeId}/ai-feedback`)}
          sx={{ cursor: 'pointer' }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            상세 AI 피드백 및 실행 계획
          </Typography>
        </Box>
      </Box>
      
      <Box className="content-area">
        {saveMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {saveMessage}
          </Alert>
        )}

        {/* AI 피드백 목록 */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          AI 피드백 목록
        </Typography>
        
        {feedbacks.map((feedback) => (
          <Card 
            key={feedback.id} 
            sx={{ 
              mb: 2, 
              cursor: 'pointer',
              border: selectedFeedbacks.includes(feedback.id) ? '2px solid #2196f3' : '1px solid #e0e0e0'
            }}
            onClick={() => handleFeedbackSelect(feedback.id)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {feedback.title}
                </Typography>
                <Chip 
                  label={feedback.category} 
                  size="small" 
                  color="primary"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {feedback.description}
              </Typography>
              
              <Divider sx={{ my: 1 }} />
              
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                추천 액션 아이템:
              </Typography>
              <List dense>
                {feedback.actionItems?.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={`• ${item}`}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
              
              <Typography variant="caption" color="text.secondary">
                우선순위: {feedback.priority} | 예상 효과: {feedback.expectedImpact}
              </Typography>
            </CardContent>
          </Card>
        ))}

        {/* 실행 계획 노트 */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              실행 계획 메모
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="선택한 피드백을 바탕으로 실행 계획을 작성해주세요..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              variant="outlined"
            />
          </CardContent>
        </Card>

        {/* 저장 버튼 */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<Save />}
          onClick={handleSaveActionPlan}
          disabled={selectedFeedbacks.length === 0}
          sx={{ mt: 3, mb: 2 }}
        >
          실행 계획 저장 ({selectedFeedbacks.length}개 선택됨)
        </Button>
      </Box>
    </Box>
  );
};

export default AIFeedbackDetail;