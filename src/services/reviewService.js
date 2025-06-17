import { reviewApi } from './api';

export const reviewService = {
  // 리뷰 작성 조건 확인
  checkWriteCondition: async (storeId) => {
    const response = await reviewApi.get('/api/reviews/write-condition', {
      params: { storeId }
    });
    return response.data;
  },

  // 리뷰 작성
  createReview: async (reviewData) => {
    const formData = new FormData();
    formData.append('content', reviewData.content);
    formData.append('rating', reviewData.rating);
    formData.append('storeId', reviewData.storeId);
    if (reviewData.receiptImage) {
      formData.append('receiptImage', reviewData.receiptImage);
    }

    const response = await reviewApi.post('/api/reviews', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // 매장 리뷰 목록 (수정됨)
  getStoreReviews: async (storeId, page = 0, size = 20) => {
    try {
      const response = await reviewApi.get(`/api/reviews/stores/${storeId}`, {
        params: { page, size }
      });
      
      console.log('API 응답 원본:', response);
      return response.data;
      
    } catch (error) {
      console.error('매장 리뷰 조회 실패:', error);
      
      if (error.response && error.response.status === 404) {
        console.warn('해당 매장의 리뷰가 없습니다.');
        return [];
      }
      
      throw error;
    }
  },

  // 리뷰 댓글 목록 조회 (추가됨)
  getReviewComments: async (reviewId) => {
    try {
      const response = await reviewApi.get(`/api/reviews/${reviewId}/comments`);
      return response.data;
    } catch (error) {
      console.error('리뷰 댓글 조회 실패:', error);
      return [];
    }
  },

  // 리뷰 상세 조회
  getReviewDetail: async (reviewId) => {
    const response = await reviewApi.get(`/api/reviews/${reviewId}`);
    return response.data;
  },

  // 내 리뷰 목록
  getMyReviews: async (page = 0, size = 20) => {
    const response = await reviewApi.get('/api/reviews/my', {
      params: { page, size }
    });
    return response.data;
  },

  // 리뷰 수정
  updateReview: async (reviewId, reviewData) => {
    const response = await reviewApi.put(`/api/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // 리뷰 삭제
  deleteReview: async (reviewId) => {
    const response = await reviewApi.delete(`/api/reviews/${reviewId}`);
    return response.data;
  },

  // 리뷰 반응 등록
  addReaction: async (reviewId, reactionType) => {
    const response = await reviewApi.post(`/api/reviews/${reviewId}/reactions`, {
      reactionType
    });
    return response.data;
  },

  // 리뷰 댓글 작성 조건 확인
  checkCommentCondition: async (reviewId) => {
    const response = await reviewApi.get(`/api/reviews/${reviewId}/comments/write-condition`);
    return response.data;
  },

  // 리뷰 댓글 작성 (수정됨)
  createComment: async (reviewId, content) => {
    console.log('댓글 작성 API 호출:', { reviewId, content });
    
    const response = await reviewApi.post(`/api/reviews/${reviewId}/comments`, {
      content
    });
    return response.data;
  },

  // 리뷰 댓글 수정 (수정됨)
  updateComment: async (reviewId, commentId, content) => {
    console.log('댓글 수정 API 호출:', { reviewId, commentId, content });
    
    const response = await reviewApi.put(`/api/reviews/${reviewId}/comments/${commentId}`, {
      content
    });
    return response.data;
  },

  // 리뷰 댓글 삭제
  deleteComment: async (reviewId, commentId) => {
    const response = await reviewApi.delete(`/api/reviews/${reviewId}/comments/${commentId}`);
    return response.data;
  },

  // 답글 작성 (createComment와 동일, 호환성을 위해 추가)
  replyToReview: async (reviewId, content) => {
    return await reviewService.createComment(reviewId, content);
  }
};