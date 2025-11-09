/**
 * 여행 일정표 자동 생성 모듈
 *
 * 선택된 교통편과 사용자 취향을 바탕으로
 * 날짜별·시간별 일정표를 자동으로 구성합니다.
 */

import { format, addMinutes, parseISO } from 'date-fns';
import type { Transport, Place, ScheduleItem, TravelInput } from '../data/types';
import { parsePreferences, calculateMatchScore } from './preferenceParser';

/**
 * 여행 일정 생성 메인 함수
 *
 * @param input - 사용자 입력 정보
 * @param selectedTransport - 사용자가 선택한 교통편
 * @param availablePlaces - 목적지 주변 장소 목록
 * @returns 일정표 배열
 */
export function generateSchedule(
  input: TravelInput,
  selectedTransport: Transport,
  availablePlaces: Place[]
): ScheduleItem[] {
  const schedule: ScheduleItem[] = [];

  // 1. 사용자 취향 키워드 추출
  const userKeywords = parsePreferences(input.preferences);

  // 2. 출발 일정 추가
  const departureDateTime = parseISO(selectedTransport.departureTime);
  schedule.push({
    date: format(departureDateTime, 'yyyy-MM-dd'),
    time: format(departureDateTime, 'HH:mm'),
    place: selectedTransport.departure.name,
    activity: '출발',
    transport: `${getTransportName(selectedTransport.type)} 탑승`,
    eta: format(parseISO(selectedTransport.arrivalTime), 'HH:mm'),
    memo: `${selectedTransport.company || ''} ${selectedTransport.duration}분 소요`,
    location: selectedTransport.departure,
  });

  // 3. 도착 일정 추가
  const arrivalDateTime = parseISO(selectedTransport.arrivalTime);
  schedule.push({
    date: format(arrivalDateTime, 'yyyy-MM-dd'),
    time: format(arrivalDateTime, 'HH:mm'),
    place: selectedTransport.arrival.name,
    activity: '도착',
    memo: `여행 시작!`,
    location: selectedTransport.arrival,
  });

  // 4. 취향에 맞는 장소 선별 및 정렬
  const recommendedPlaces = availablePlaces
    .map(place => ({
      place,
      score: calculateMatchScore(place.tags, userKeywords),
    }))
    .filter(item => item.score > 0.2) // 최소 매칭 점수 필터
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // 상위 5개만

  // 5. 도착 후 일정 생성 (첫날)
  let currentTime = arrivalDateTime;

  // 점심 시간이면 맛집 추가
  const arrivalHour = arrivalDateTime.getHours();
  if (arrivalHour >= 11 && arrivalHour < 14) {
    const restaurant = recommendedPlaces.find(
      item => item.place.category === 'restaurant'
    );
    if (restaurant) {
      currentTime = addMinutes(currentTime, 30);
      schedule.push({
        date: format(currentTime, 'yyyy-MM-dd'),
        time: format(currentTime, 'HH:mm'),
        place: restaurant.place.name,
        activity: '점심 식사',
        eta: format(addMinutes(currentTime, 60), 'HH:mm'),
        memo: restaurant.place.tags.join(', '),
        location: restaurant.place.location,
      });
      currentTime = addMinutes(currentTime, 90);
    }
  }

  // 관광지 방문
  recommendedPlaces
    .filter(item => item.place.category === 'attraction' || item.place.category === 'cafe')
    .slice(0, 3)
    .forEach((item) => {
      const travelTime = 20; // 이동 시간 20분
      currentTime = addMinutes(currentTime, travelTime);

      schedule.push({
        date: format(currentTime, 'yyyy-MM-dd'),
        time: format(currentTime, 'HH:mm'),
        place: item.place.name,
        activity: item.place.category === 'cafe' ? '카페 방문' : '관광',
        eta: format(addMinutes(currentTime, 60), 'HH:mm'),
        memo: `추천도: ${(item.score * 100).toFixed(0)}% - ${item.place.tags.join(', ')}`,
        location: item.place.location,
      });

      currentTime = addMinutes(currentTime, 60 + travelTime);
    });

  // 6. 저녁 식사
  const dinnerRestaurant = recommendedPlaces.find(
    item => item.place.category === 'restaurant'
  );
  if (dinnerRestaurant && currentTime.getHours() >= 17) {
    schedule.push({
      date: format(currentTime, 'yyyy-MM-dd'),
      time: format(currentTime, 'HH:mm'),
      place: dinnerRestaurant.place.name,
      activity: '저녁 식사',
      eta: format(addMinutes(currentTime, 90), 'HH:mm'),
      memo: dinnerRestaurant.place.tags.join(', '),
      location: dinnerRestaurant.place.location,
    });
    currentTime = addMinutes(currentTime, 120);
  }

  // 7. 숙소 체크인
  const hotel = availablePlaces.find(p => p.category === 'hotel');
  if (hotel) {
    currentTime = addMinutes(currentTime, 30);
    schedule.push({
      date: format(currentTime, 'yyyy-MM-dd'),
      time: format(currentTime, 'HH:mm'),
      place: hotel.name,
      activity: '숙소 체크인',
      memo: '휴식 시간',
      location: hotel.location,
    });
  }

  return schedule;
}

/**
 * 교통수단 이름 변환
 */
function getTransportName(type: string): string {
  const names: Record<string, string> = {
    flight: '항공',
    train: '기차',
    bus: '버스',
  };
  return names[type] || type;
}

/**
 * 일정표를 날짜별로 그룹화
 */
export function groupScheduleByDate(schedule: ScheduleItem[]): Record<string, ScheduleItem[]> {
  return schedule.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = [];
    }
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, ScheduleItem[]>);
}
