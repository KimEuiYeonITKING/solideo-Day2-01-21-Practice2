<template>
  <div class="result-page">
    <!-- 헤더 -->
    <header class="header">
      <button @click="goBack" class="back-btn">← 돌아가기</button>
      <h1>{{ travelInput?.departure.name }} → {{ travelInput?.arrival.name }}</h1>
    </header>

    <div class="container">
      <!-- 좌측: 필터 및 일정표 -->
      <aside class="sidebar">
        <!-- 교통편 목록 -->
        <TransportList
          :transports="availableTransports"
          :selected-transport-id="selectedTransport?.id"
          @select="handleTransportSelect"
        />

        <!-- 일정표 -->
        <ScheduleTable
          :schedule-items="schedule"
          :highlighted-item-index="highlightedScheduleIndex"
          @row-click="handleScheduleRowClick"
        />
      </aside>

      <!-- 우측: 지도 -->
      <main class="map-section">
        <MapComponent
          :schedule-items="schedule"
          :highlighted-item-index="highlightedScheduleIndex"
          @marker-click="handleMarkerClick"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TransportList from '../components/TransportList.vue';
import ScheduleTable from '../components/ScheduleTable.vue';
import MapComponent from '../components/MapComponent.vue';
import type { TravelInput, Transport, ScheduleItem } from '../data/types';
import { mockTransports } from '../data/mockTransports';
import { mockPlaces } from '../data/mockPlaces';
import { generateSchedule } from '../logic/schedulePlanner';

const router = useRouter();

// 상태
const travelInput = ref<TravelInput | null>(null);
const selectedTransport = ref<Transport | null>(null);
const highlightedScheduleIndex = ref<number | undefined>(undefined);

// LocalStorage에서 여행 입력 데이터 로드
onMounted(() => {
  const savedInput = localStorage.getItem('travelInput');
  if (!savedInput) {
    alert('여행 정보가 없습니다. 홈으로 돌아갑니다.');
    router.push('/');
    return;
  }

  travelInput.value = JSON.parse(savedInput);

  // 첫 번째 교통편 자동 선택
  if (availableTransports.value.length > 0) {
    selectedTransport.value = availableTransports.value[0];
  }
});

// 사용 가능한 교통편 필터링
const availableTransports = computed(() => {
  if (!travelInput.value) return [];

  return mockTransports.filter(transport => {
    // 출발지와 도착지 매칭
    const matchesRoute =
      transport.departure.name === travelInput.value!.departure.name &&
      transport.arrival.name === travelInput.value!.arrival.name;

    // 교통수단 타입 매칭
    const matchesType = travelInput.value!.transportTypes.includes(transport.type);

    // 날짜 매칭 (간단히 시작 날짜만 체크)
    const departureDate = new Date(transport.departureTime).toISOString().split('T')[0];
    const matchesDate = departureDate === travelInput.value!.startDate;

    return matchesRoute && matchesType && matchesDate;
  });
});

// 일정 생성
const schedule = computed<ScheduleItem[]>(() => {
  if (!travelInput.value || !selectedTransport.value) return [];

  // 도착지 주변 장소 필터링
  const destinationPlaces = mockPlaces.filter(place => {
    // 간단히 도착지 이름으로 필터링 (실제로는 더 정교한 로직 필요)
    return place.location.name.includes(travelInput.value!.arrival.name.split(' ')[0]);
  });

  return generateSchedule(travelInput.value, selectedTransport.value, destinationPlaces);
});

// 교통편 선택 핸들러
function handleTransportSelect(transport: Transport) {
  selectedTransport.value = transport;
  highlightedScheduleIndex.value = undefined; // 하이라이트 초기화
}

// 일정표 행 클릭 핸들러
function handleScheduleRowClick(index: number) {
  highlightedScheduleIndex.value = index;
}

// 지도 마커 클릭 핸들러
function handleMarkerClick(index: number) {
  highlightedScheduleIndex.value = index;
}

// 뒤로 가기
function goBack() {
  router.push('/');
}
</script>

<style scoped>
.result-page {
  min-height: 100vh;
  background: #f3f4f6;
}

.header {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.back-btn:hover {
  background: #e5e7eb;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #1f2937;
}

.container {
  display: grid;
  grid-template-columns: 450px 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  max-width: 1800px;
  margin: 0 auto;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.map-section {
  position: sticky;
  top: 1.5rem;
  height: calc(100vh - 120px);
}

@media (max-width: 1200px) {
  .container {
    grid-template-columns: 1fr;
  }

  .map-section {
    position: relative;
    top: 0;
    height: 500px;
  }
}
</style>
