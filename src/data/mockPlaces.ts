import type { Place } from './types';

// 부산 관광지 및 장소
export const mockPlaces: Place[] = [
  // 부산 카페
  {
    id: 'cafe-001',
    name: '해운대 오션뷰 카페',
    location: { lat: 35.1586, lng: 129.1604, name: '해운대 오션뷰 카페' },
    tags: ['카페', '바다뷰', '인스타감성', '조용한'],
    category: 'cafe',
    description: '해운대 바다가 한눈에 보이는 감성 카페',
  },
  {
    id: 'cafe-002',
    name: '광안리 루프탑 카페',
    location: { lat: 35.1532, lng: 129.1189, name: '광안리 루프탑 카페' },
    tags: ['카페', '바다뷰', '인스타감성', '데이트'],
    category: 'cafe',
    description: '광안대교를 바라보며 커피를 즐길 수 있는 곳',
  },
  {
    id: 'cafe-003',
    name: '송정 서핑 카페',
    location: { lat: 35.1786, lng: 129.1997, name: '송정 서핑 카페' },
    tags: ['카페', '바다', '힙한', '서핑'],
    category: 'cafe',
    description: '서핑 후 들리기 좋은 힙한 카페',
  },

  // 부산 맛집
  {
    id: 'restaurant-001',
    name: '자갈치 해산물 맛집',
    location: { lat: 35.0965, lng: 129.0305, name: '자갈치 해산물 맛집' },
    tags: ['맛집', '해산물', '전통', '활기찬'],
    category: 'restaurant',
    description: '신선한 해산물을 맛볼 수 있는 전통 시장',
  },
  {
    id: 'restaurant-002',
    name: '서면 돼지국밥 골목',
    location: { lat: 35.1580, lng: 129.0595, name: '서면 돼지국밥 골목' },
    tags: ['맛집', '로컬맛집', '저렴한', '활기찬'],
    category: 'restaurant',
    description: '부산의 소울푸드, 돼지국밥 맛집 거리',
  },
  {
    id: 'restaurant-003',
    name: '해운대 회센터',
    location: { lat: 35.1621, lng: 129.1634, name: '해운대 회센터' },
    tags: ['맛집', '회', '바다뷰', '데이트'],
    category: 'restaurant',
    description: '싱싱한 회와 함께 바다를 감상할 수 있는 곳',
  },

  // 부산 관광지
  {
    id: 'attraction-001',
    name: '감천문화마을',
    location: { lat: 35.0976, lng: 129.0106, name: '감천문화마을' },
    tags: ['관광지', '인스타감성', '예술', '색채'],
    category: 'attraction',
    description: '부산의 산토리니, 알록달록한 벽화 마을',
  },
  {
    id: 'attraction-002',
    name: '해동용궁사',
    location: { lat: 35.1883, lng: 129.2231, name: '해동용궁사' },
    tags: ['관광지', '바다', '사찰', '조용한', '힐링'],
    category: 'attraction',
    description: '바다 위에 지어진 아름다운 사찰',
  },
  {
    id: 'attraction-003',
    name: '태종대',
    location: { lat: 35.0512, lng: 129.0864, name: '태종대' },
    tags: ['관광지', '자연', '바다', '산책', '조용한'],
    category: 'attraction',
    description: '부산의 절경을 감상할 수 있는 자연 명소',
  },
  {
    id: 'attraction-004',
    name: '해운대 해수욕장',
    location: { lat: 35.1587, lng: 129.1604, name: '해운대 해수욕장' },
    tags: ['관광지', '바다', '해변', '활기찬', '여름'],
    category: 'attraction',
    description: '한국에서 가장 유명한 해수욕장',
  },

  // 제주 관광지
  {
    id: 'attraction-jeju-001',
    name: '성산일출봉',
    location: { lat: 33.4583, lng: 126.9422, name: '성산일출봉' },
    tags: ['관광지', '자연', '등산', '일출', '바다'],
    category: 'attraction',
    description: '유네스코 세계자연유산, 일출 명소',
  },
  {
    id: 'cafe-jeju-001',
    name: '애월 카페거리',
    location: { lat: 33.4678, lng: 126.3196, name: '애월 카페거리' },
    tags: ['카페', '바다뷰', '인스타감성', '힙한'],
    category: 'cafe',
    description: '제주 바다를 감상하며 커피를 즐기는 카페 거리',
  },

  // 오사카 관광지
  {
    id: 'attraction-osaka-001',
    name: '도톤보리',
    location: { lat: 34.6686, lng: 135.5004, name: '도톤보리' },
    tags: ['관광지', '쇼핑', '맛집', '활기찬', '야경'],
    category: 'attraction',
    description: '오사카의 대표 번화가',
  },
  {
    id: 'cafe-osaka-001',
    name: '난바 레트로 카페',
    location: { lat: 34.6652, lng: 135.5005, name: '난바 레트로 카페' },
    tags: ['카페', '레트로', '조용한', '인스타감성'],
    category: 'cafe',
    description: '레트로 감성의 조용한 카페',
  },

  // 강릉
  {
    id: 'cafe-gangneung-001',
    name: '안목해변 카페거리',
    location: { lat: 37.7715, lng: 128.9470, name: '안목해변 카페거리' },
    tags: ['카페', '바다뷰', '커피', '산책'],
    category: 'cafe',
    description: '커피 향 가득한 바닷가 카페 거리',
  },
  {
    id: 'attraction-gangneung-001',
    name: '경포대 해수욕장',
    location: { lat: 37.8053, lng: 128.9087, name: '경포대 해수욕장' },
    tags: ['관광지', '바다', '해변', '조용한', '자연'],
    category: 'attraction',
    description: '동해안의 아름다운 해변',
  },

  // 호텔 (숙박)
  {
    id: 'hotel-001',
    name: '해운대 씨사이드 호텔',
    location: { lat: 35.1587, lng: 129.1604, name: '해운대 씨사이드 호텔' },
    tags: ['숙박', '바다뷰', '럭셔리', '해운대'],
    category: 'hotel',
    description: '해운대 바다를 바라보는 호텔',
  },
];
