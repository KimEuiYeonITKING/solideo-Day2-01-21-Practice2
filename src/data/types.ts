// 좌표 타입
export interface Location {
  lat: number;
  lng: number;
  name: string;
}

// 교통수단 타입
export type TransportType = 'flight' | 'train' | 'bus';

// 교통편 인터페이스
export interface Transport {
  id: string;
  type: TransportType;
  departureTime: string; // ISO 8601 format
  arrivalTime: string;
  duration: number; // 분 단위
  price: number; // 원화
  departure: Location;
  arrival: Location;
  isCancellable: boolean; // 취소표 여부
  company?: string; // 운행사
}

// 장소 인터페이스
export interface Place {
  id: string;
  name: string;
  location: Location;
  tags: string[]; // ['카페', '바다뷰', '조용한']
  category: 'restaurant' | 'cafe' | 'attraction' | 'hotel';
  description?: string;
}

// 일정 항목 인터페이스
export interface ScheduleItem {
  date: string;
  time: string;
  place: string;
  activity: string;
  transport?: string;
  eta?: string; // 예상 도착 시간
  memo?: string;
  location?: Location;
}

// 사용자 입력 인터페이스
export interface TravelInput {
  departure: Location;
  arrival: Location;
  startDate: string;
  endDate: string;
  departureTime: string;
  transportTypes: TransportType[];
  budget?: number;
  preferences: string; // 자유 텍스트
}
