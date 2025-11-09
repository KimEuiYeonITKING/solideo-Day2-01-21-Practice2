import type { Transport, Location } from './types';

// 주요 도시 좌표
export const LOCATIONS: Record<string, Location> = {
  seoul: { lat: 37.5665, lng: 126.9780, name: '서울역' },
  busan: { lat: 35.1796, lng: 129.0756, name: '부산역' },
  jeju: { lat: 33.5097, lng: 126.4919, name: '제주공항' },
  incheon: { lat: 37.4563, lng: 126.7052, name: '인천공항' },
  osaka: { lat: 34.6937, lng: 135.5023, name: '오사카 난바역' },
  tokyo: { lat: 35.6812, lng: 139.7671, name: '도쿄역' },
  gangneung: { lat: 37.7519, lng: 128.8761, name: '강릉역' },
  daegu: { lat: 35.8714, lng: 128.6014, name: '대구역' },
};

// 더미 교통편 데이터
export const mockTransports: Transport[] = [
  // 서울 → 부산 (KTX)
  {
    id: 'ktx-001',
    type: 'train',
    departureTime: '2025-08-10T08:00:00',
    arrivalTime: '2025-08-10T10:30:00',
    duration: 150,
    price: 59800,
    departure: LOCATIONS.seoul,
    arrival: LOCATIONS.busan,
    isCancellable: true,
    company: 'KTX',
  },
  {
    id: 'ktx-002',
    type: 'train',
    departureTime: '2025-08-10T09:30:00',
    arrivalTime: '2025-08-10T12:00:00',
    duration: 150,
    price: 54800, // 취소표
    departure: LOCATIONS.seoul,
    arrival: LOCATIONS.busan,
    isCancellable: true,
    company: 'KTX',
  },

  // 서울 → 부산 (버스)
  {
    id: 'bus-001',
    type: 'bus',
    departureTime: '2025-08-10T08:30:00',
    arrivalTime: '2025-08-10T13:00:00',
    duration: 270,
    price: 32000,
    departure: LOCATIONS.seoul,
    arrival: LOCATIONS.busan,
    isCancellable: false,
    company: '동서고속',
  },
  {
    id: 'bus-002',
    type: 'bus',
    departureTime: '2025-08-10T10:00:00',
    arrivalTime: '2025-08-10T14:30:00',
    duration: 270,
    price: 28000, // 취소표
    departure: LOCATIONS.seoul,
    arrival: LOCATIONS.busan,
    isCancellable: true,
    company: '금호고속',
  },

  // 인천 → 제주 (비행기)
  {
    id: 'flight-001',
    type: 'flight',
    departureTime: '2025-08-10T10:00:00',
    arrivalTime: '2025-08-10T11:10:00',
    duration: 70,
    price: 89000,
    departure: LOCATIONS.incheon,
    arrival: LOCATIONS.jeju,
    isCancellable: true,
    company: '대한항공',
  },
  {
    id: 'flight-002',
    type: 'flight',
    departureTime: '2025-08-10T12:00:00',
    arrivalTime: '2025-08-10T13:10:00',
    duration: 70,
    price: 72000, // 취소표
    departure: LOCATIONS.incheon,
    arrival: LOCATIONS.jeju,
    isCancellable: true,
    company: '제주항공',
  },
  {
    id: 'flight-003',
    type: 'flight',
    departureTime: '2025-08-10T14:00:00',
    arrivalTime: '2025-08-10T15:10:00',
    duration: 70,
    price: 95000,
    departure: LOCATIONS.incheon,
    arrival: LOCATIONS.jeju,
    isCancellable: false,
    company: '진에어',
  },

  // 인천 → 오사카 (국제선)
  {
    id: 'flight-int-001',
    type: 'flight',
    departureTime: '2025-08-10T09:00:00',
    arrivalTime: '2025-08-10T10:30:00',
    duration: 150,
    price: 250000,
    departure: LOCATIONS.incheon,
    arrival: LOCATIONS.osaka,
    isCancellable: true,
    company: '아시아나',
  },
  {
    id: 'flight-int-002',
    type: 'flight',
    departureTime: '2025-08-10T13:00:00',
    arrivalTime: '2025-08-10T14:30:00',
    duration: 150,
    price: 198000, // 취소표
    departure: LOCATIONS.incheon,
    arrival: LOCATIONS.osaka,
    isCancellable: true,
    company: '티웨이',
  },

  // 서울 → 강릉 (기차)
  {
    id: 'ktx-101',
    type: 'train',
    departureTime: '2025-08-10T08:15:00',
    arrivalTime: '2025-08-10T10:10:00',
    duration: 115,
    price: 23700,
    departure: LOCATIONS.seoul,
    arrival: LOCATIONS.gangneung,
    isCancellable: true,
    company: 'KTX',
  },
  {
    id: 'ktx-102',
    type: 'train',
    departureTime: '2025-08-10T11:00:00',
    arrivalTime: '2025-08-10T12:55:00',
    duration: 115,
    price: 21000, // 취소표
    departure: LOCATIONS.seoul,
    arrival: LOCATIONS.gangneung,
    isCancellable: true,
    company: 'KTX',
  },

  // 서울 → 대구 (KTX)
  {
    id: 'ktx-201',
    type: 'train',
    departureTime: '2025-08-10T08:30:00',
    arrivalTime: '2025-08-10T10:20:00',
    duration: 110,
    price: 35400,
    departure: LOCATIONS.seoul,
    arrival: LOCATIONS.daegu,
    isCancellable: false,
    company: 'KTX',
  },
];
