<template>
  <div class="schedule-table">
    <h2>여행 일정표</h2>

    <div v-if="scheduleItems.length === 0" class="no-schedule">
      <p>먼저 교통편을 선택해주세요.</p>
    </div>

    <div v-else class="schedule-content">
      <!-- 날짜별로 그룹화된 일정 -->
      <div v-for="(items, date) in groupedSchedule" :key="date" class="date-group">
        <h3 class="date-header">{{ formatDate(date) }}</h3>

        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>시간</th>
                <th>장소/활동</th>
                <th>이동수단</th>
                <th>예상 도착</th>
                <th>메모</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in items"
                :key="index"
                class="schedule-row"
                :class="{ highlighted: isHighlighted(date, index) }"
                @click="handleRowClick(date, index)"
              >
                <td class="time-cell">{{ item.time }}</td>
                <td class="place-cell">
                  <div class="place-name">{{ item.place }}</div>
                  <div class="activity">{{ item.activity }}</div>
                </td>
                <td class="transport-cell">{{ item.transport || '-' }}</td>
                <td class="eta-cell">{{ item.eta || '-' }}</td>
                <td class="memo-cell">{{ item.memo || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';
import type { ScheduleItem } from '../data/types';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { groupScheduleByDate } from '../logic/schedulePlanner';

const props = defineProps<{
  scheduleItems: ScheduleItem[];
  highlightedItemIndex?: number;
}>();

const emit = defineEmits<{
  rowClick: [index: number];
}>();

// 날짜별로 그룹화된 일정
const groupedSchedule = computed(() => {
  return groupScheduleByDate(props.scheduleItems);
});

// 날짜 포맷팅
function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'yyyy년 M월 d일 (E)', { locale: ko });
  } catch {
    return dateString;
  }
}

// 하이라이트 여부 확인
function isHighlighted(date: string, indexInGroup: number): boolean {
  if (props.highlightedItemIndex === undefined) return false;

  // 전체 일정에서의 인덱스 계산
  let globalIndex = 0;
  for (const [d, items] of Object.entries(groupedSchedule.value)) {
    if (d === date) {
      return globalIndex + indexInGroup === props.highlightedItemIndex;
    }
    globalIndex += items.length;
  }
  return false;
}

// 행 클릭 핸들러
function handleRowClick(date: string, indexInGroup: number) {
  // 전체 일정에서의 인덱스 계산
  let globalIndex = 0;
  for (const [d, items] of Object.entries(groupedSchedule.value)) {
    if (d === date) {
      emit('rowClick', globalIndex + indexInGroup);
      return;
    }
    globalIndex += items.length;
  }
}
</script>

<style scoped>
.schedule-table {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  color: #1f2937;
}

.no-schedule {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.schedule-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.date-group {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.date-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1rem;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f9fafb;
}

th {
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #4b5563;
  font-size: 0.9rem;
  border-bottom: 2px solid #e5e7eb;
}

tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
  cursor: pointer;
}

tbody tr:hover {
  background: #f9fafb;
}

tbody tr.highlighted {
  background: #eff6ff;
  border-left: 4px solid #3b82f6;
}

td {
  padding: 0.75rem;
  font-size: 0.9rem;
}

.time-cell {
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
}

.place-cell {
  min-width: 150px;
}

.place-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.activity {
  font-size: 0.85rem;
  color: #6b7280;
}

.transport-cell,
.eta-cell {
  color: #6b7280;
  white-space: nowrap;
}

.memo-cell {
  color: #6b7280;
  font-size: 0.85rem;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  table {
    font-size: 0.8rem;
  }

  th,
  td {
    padding: 0.5rem;
  }

  .memo-cell {
    display: none;
  }
}
</style>
