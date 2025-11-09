<template>
  <div class="transport-list">
    <h2>교통편 옵션</h2>

    <!-- 정렬 및 필터 -->
    <div class="controls">
      <div class="control-group">
        <label>정렬:</label>
        <select v-model="sortBy">
          <option value="price-asc">최저 가격순</option>
          <option value="price-desc">최고 가격순</option>
          <option value="duration-asc">최단 시간순</option>
          <option value="duration-desc">최장 시간순</option>
        </select>
      </div>

      <div class="control-group">
        <label>
          <input type="checkbox" v-model="showCancellableOnly" />
          취소표만 보기
        </label>
      </div>
    </div>

    <!-- 교통편 리스트 -->
    <div v-if="filteredAndSortedTransports.length === 0" class="no-results">
      <p>조건에 맞는 교통편이 없습니다.</p>
    </div>

    <div v-else class="transport-items">
      <div
        v-for="transport in filteredAndSortedTransports"
        :key="transport.id"
        class="transport-item"
        :class="{ selected: selectedTransportId === transport.id }"
        @click="selectTransport(transport)"
      >
        <div class="transport-header">
          <span class="transport-type" :class="`type-${transport.type}`">
            {{ getTransportTypeName(transport.type) }}
          </span>
          <span v-if="transport.isCancellable" class="badge-cancellable">취소가능</span>
        </div>

        <div class="transport-route">
          <div class="route-point">
            <div class="time">{{ formatTime(transport.departureTime) }}</div>
            <div class="location">{{ transport.departure.name }}</div>
          </div>

          <div class="route-line">
            <div class="duration">{{ formatDuration(transport.duration) }}</div>
          </div>

          <div class="route-point">
            <div class="time">{{ formatTime(transport.arrivalTime) }}</div>
            <div class="location">{{ transport.arrival.name }}</div>
          </div>
        </div>

        <div class="transport-footer">
          <div class="company">{{ transport.company }}</div>
          <div class="price">{{ transport.price.toLocaleString() }}원</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';
import type { Transport } from '../data/types';
import { format, parseISO } from 'date-fns';

const props = defineProps<{
  transports: Transport[];
  selectedTransportId?: string;
}>();

const emit = defineEmits<{
  select: [transport: Transport];
}>();

// 상태
const sortBy = ref<'price-asc' | 'price-desc' | 'duration-asc' | 'duration-desc'>('price-asc');
const showCancellableOnly = ref(false);

// 필터링 및 정렬된 교통편
const filteredAndSortedTransports = computed(() => {
  let result = [...props.transports];

  // 필터: 취소표만 보기
  if (showCancellableOnly.value) {
    result = result.filter(t => t.isCancellable);
  }

  // 정렬
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'duration-asc':
        return a.duration - b.duration;
      case 'duration-desc':
        return b.duration - a.duration;
      default:
        return 0;
    }
  });

  return result;
});

// 교통편 선택
function selectTransport(transport: Transport) {
  emit('select', transport);
}

// 시간 포맷팅
function formatTime(isoString: string): string {
  return format(parseISO(isoString), 'HH:mm');
}

// 소요 시간 포맷팅
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
}

// 교통수단 이름
function getTransportTypeName(type: string): string {
  const names: Record<string, string> = {
    flight: '항공',
    train: '기차',
    bus: '버스',
  };
  return names[type] || type;
}
</script>

<style scoped>
.transport-list {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  color: #1f2937;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-group label {
  font-size: 0.9rem;
  color: #4b5563;
}

.control-group select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.no-results {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.transport-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 600px;
  overflow-y: auto;
}

.transport-item {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.transport-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.1);
}

.transport-item.selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.transport-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.transport-type {
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.type-flight {
  background: #dbeafe;
  color: #1e40af;
}

.type-train {
  background: #d1fae5;
  color: #065f46;
}

.type-bus {
  background: #fef3c7;
  color: #92400e;
}

.badge-cancellable {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: #dcfce7;
  color: #166534;
  border-radius: 4px;
}

.transport-route {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.route-point {
  flex: 1;
}

.route-point .time {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.route-point .location {
  font-size: 0.9rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.route-line {
  flex: 1;
  text-align: center;
  position: relative;
  padding: 0 1rem;
}

.route-line::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #d1d5db;
}

.duration {
  position: relative;
  background: white;
  padding: 0.25rem 0.5rem;
  font-size: 0.85rem;
  color: #6b7280;
  display: inline-block;
}

.transport-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.company {
  font-size: 0.9rem;
  color: #6b7280;
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #3b82f6;
}
</style>
