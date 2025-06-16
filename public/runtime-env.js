window.__runtime_config__ = { 
   // 각 마이크로서비스별 호스트 설정
   AUTH_SERVICE_URL: 'http://127.0.0.1:8081',      // 인증 서비스
   MEMBER_SERVICE_URL: 'http://127.0.0.1:8081',    // 회원 서비스 (인증과 같은 서버)
   STORE_SERVICE_URL: 'http://127.0.0.1:8082',     // 매장 서비스
   REVIEW_SERVICE_URL: 'http://127.0.0.1:8083',    // 리뷰 서비스
   ANALYTICS_SERVICE_URL: 'http://127.0.0.1:8084', // 분석 서비스
   RECOMMEND_SERVICE_URL: 'http://127.0.0.1:8085', // 추천 서비스
   
   // 또는 API Gateway 사용하는 경우
   // API_GATEWAY_URL: 'http://20.1.2.3:8080'
}
































































































