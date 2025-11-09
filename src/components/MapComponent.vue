<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue';
import L from 'leaflet';
import type { ScheduleItem } from '../data/types';

// Props 정의
const props = defineProps<{
  scheduleItems: ScheduleItem[];
  highlightedItemIndex?: number;
}>();

// Emits 정의
const emit = defineEmits<{
  markerClick: [index: number];
}>();

// Refs
const mapContainer = ref<HTMLDivElement | null>(null);
let map: L.Map | null = null;
let markers: L.Marker[] = [];
let polyline: L.Polyline | null = null;

/**
 * 지도 초기화 함수
 */
onMounted(() => {
  if (!mapContainer.value) return;

  // Leaflet 지도 생성 (OpenStreetMap 타일 사용, API Key 불필요!)
  map = L.map(mapContainer.value).setView([37.5665, 126.978], 7);

  // OpenStreetMap 타일 레이어 추가
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  // 초기 데이터가 있으면 렌더링
  if (props.scheduleItems.length > 0) {
    updateMap();
  }
});

/**
 * 스케줄 아이템이 변경될 때마다 지도 업데이트
 */
watch(() => props.scheduleItems, updateMap, { deep: true });

/**
 * 하이라이트된 아이템이 변경될 때마다 해당 마커로 이동
 */
watch(() => props.highlightedItemIndex, (newIndex) => {
  if (newIndex !== undefined && newIndex >= 0 && newIndex < markers.length) {
    const marker = markers[newIndex];
    if (map && marker) {
      // 지도 중앙을 해당 마커로 이동하고 줌 레벨 조정
      map.setView(marker.getLatLng(), 13, { animate: true });
      marker.openPopup();
    }
  }
});

/**
 * 지도 업데이트 함수
 */
function updateMap() {
  if (!map) return;

  // 기존 마커 및 폴리라인 제거
  markers.forEach(marker => marker.remove());
  markers = [];
  if (polyline) {
    polyline.remove();
    polyline = null;
  }

  // 위치 정보가 있는 아이템만 필터링
  const itemsWithLocation = props.scheduleItems.filter(item => item.location);
  if (itemsWithLocation.length === 0) return;

  // 경로 좌표 배열
  const routeCoords: L.LatLngExpression[] = [];

  // 마커 생성
  itemsWithLocation.forEach((item, index) => {
    if (!item.location) return;

    const { lat, lng } = item.location;
    routeCoords.push([lat, lng]);

    // 마커 아이콘 색상 결정
    const iconColor = getMarkerColor(item.activity);

    // 커스텀 마커 생성
    const marker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${iconColor}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${index + 1}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      }),
    });

    // 팝업 추가
    marker.bindPopup(`
      <div style="min-width: 200px;">
        <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #333;">${item.place}</h3>
        <p style="margin: 5px 0;"><strong>시간:</strong> ${item.time}${item.eta ? ` ~ ${item.eta}` : ''}</p>
        <p style="margin: 5px 0;"><strong>활동:</strong> ${item.activity}</p>
        ${item.transport ? `<p style="margin: 5px 0;"><strong>교통:</strong> ${item.transport}</p>` : ''}
        ${item.memo ? `<p style="margin: 5px 0; font-size: 12px; color: #666;">${item.memo}</p>` : ''}
      </div>
    `);

    // 마커 클릭 이벤트
    marker.on('click', () => {
      emit('markerClick', index);
    });

    marker.addTo(map!);
    markers.push(marker);
  });

  // 경로 폴리라인 그리기
  if (routeCoords.length > 1) {
    polyline = L.polyline(routeCoords, {
      color: '#3b82f6',
      weight: 3,
      opacity: 0.7,
      dashArray: '10, 10', // 점선 효과
    }).addTo(map);

    // 모든 마커가 보이도록 지도 범위 조정
    const bounds = L.latLngBounds(routeCoords);
    map.fitBounds(bounds, { padding: [50, 50] });
  } else if (routeCoords.length === 1) {
    // 단일 마커인 경우
    map.setView(routeCoords[0], 12);
  }
}

/**
 * 활동 타입에 따른 마커 색상 결정
 */
function getMarkerColor(activity: string): string {
  const colorMap: Record<string, string> = {
    '출발': '#10b981', // 초록
    '도착': '#3b82f6', // 파랑
    '점심 식사': '#f59e0b', // 주황
    '저녁 식사': '#ef4444', // 빨강
    '카페 방문': '#8b5cf6', // 보라
    '관광': '#06b6d4', // 청록
    '숙소 체크인': '#6366f1', // 인디고
  };

  for (const [key, color] of Object.entries(colorMap)) {
    if (activity.includes(key)) {
      return color;
    }
  }

  return '#64748b'; // 기본 회색
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
