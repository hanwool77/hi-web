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

  // 매장 리뷰 목록
  getStoreReviews: async (storeId, page = 0, size = 20) => {
    const response = await reviewApi.get(`/api/reviews/stores/${storeId}`, {
      params: { page, size }
    });
    return response.data;
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

  // 리뷰 댓글 작성
  createComment: async (reviewId, content) => {
    const response = await reviewApi.post(`/api/reviews/${reviewId}/comments`, {
      content
    });
    return response.data;
  },

  // 리뷰 댓글 수정
  updateComment: async (reviewId, commentId, content) => {
    const response = await reviewApi.put(`/api/reviews/${reviewId}/comments/${commentId}`, {
      content
    });
    return response.data;
  },

  // 리뷰 댓글 삭제
  deleteComment: async (reviewId, commentId) => {
    const response = await reviewApi.delete(`/api/reviews/${reviewId}/comments/${commentId}`);
    return response.data;
  }
};