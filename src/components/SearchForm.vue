<template>
  <div class="search-form">
    <h1>여행 플래너</h1>
    <p class="subtitle">나만의 맞춤 여행 일정을 만들어보세요</p>

    <form @submit.prevent="handleSubmit">
      <!-- 출발지/도착지 -->
      <div class="form-row">
        <div class="form-group">
          <label for="departure">출발지</label>
          <select id="departure" v-model="formData.departure" required>
            <option value="">선택하세요</option>
            <option v-for="loc in locationOptions" :key="loc.value" :value="loc.value">
              {{ loc.label }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="arrival">도착지</label>
          <select id="arrival" v-model="formData.arrival" required>
            <option value="">선택하세요</option>
            <option v-for="loc in locationOptions" :key="loc.value" :value="loc.value">
              {{ loc.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- 여행 기간 -->
      <div class="form-row">
        <div class="form-group">
          <label for="startDate">여행 시작일</label>
          <input
            type="date"
            id="startDate"
            v-model="formData.startDate"
            required
            :min="today"
          />
        </div>

        <div class="form-group">
          <label for="endDate">여행 종료일</label>
          <input
            type="date"
            id="endDate"
            v-model="formData.endDate"
            required
            :min="formData.startDate || today"
          />
        </div>
      </div>

      <!-- 출발 시간 -->
      <div class="form-group">
        <label for="departureTime">희망 출발 시간</label>
        <input
          type="time"
          id="departureTime"
          v-model="formData.departureTime"
          required
        />
      </div>

      <!-- 교통수단 선택 (다중 선택) -->
      <div class="form-group">
        <label>교통수단</label>
        <div class="checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" value="flight" v-model="formData.transportTypes" />
            비행기
          </label>
          <label class="checkbox-label">
            <input type="checkbox" value="train" v-model="formData.transportTypes" />
            기차
          </label>
          <label class="checkbox-label">
            <input type="checkbox" value="bus" v-model="formData.transportTypes" />
            버스
          </label>
        </div>
      </div>

      <!-- 예산 (선택) -->
      <div class="form-group">
        <label for="budget">예산 (선택)</label>
        <input
          type="number"
          id="budget"
          v-model.number="formData.budget"
          placeholder="예: 500000"
          min="0"
        />
      </div>

      <!-- 취향 텍스트 -->
      <div class="form-group">
        <label for="preferences">여행 취향</label>
        <textarea
          id="preferences"
          v-model="formData.preferences"
          rows="4"
          placeholder="예: 카페 많이 가고 싶고, 인스타 감성 좋아함, 사람 많은 곳은 싫어"
          required
        ></textarea>
      </div>

      <!-- 제출 버튼 -->
      <button type="submit" class="submit-btn">
        일정 추천 받기
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { LOCATIONS } from '../data/mockTransports';
import type { TravelInput, TransportType } from '../data/types';

const router = useRouter();

// 오늘 날짜
const today = computed(() => {
  const date = new Date();
  return date.toISOString().split('T')[0];
});

// 위치 옵션
const locationOptions = Object.keys(LOCATIONS).map(key => ({
  value: key,
  label: LOCATIONS[key].name,
}));

// 폼 데이터
const formData = reactive({
  departure: '',
  arrival: '',
  startDate: '',
  endDate: '',
  departureTime: '08:00',
  transportTypes: [] as TransportType[],
  budget: undefined as number | undefined,
  preferences: '',
});

// 폼 제출
function handleSubmit() {
  // 유효성 검사
  if (formData.transportTypes.length === 0) {
    alert('교통수단을 최소 하나 이상 선택해주세요.');
    return;
  }

  if (formData.departure === formData.arrival) {
    alert('출발지와 도착지가 같을 수 없습니다.');
    return;
  }

  // 여행 입력 데이터 생성
  const travelInput: TravelInput = {
    departure: LOCATIONS[formData.departure],
    arrival: LOCATIONS[formData.arrival],
    startDate: formData.startDate,
    endDate: formData.endDate,
    departureTime: formData.departureTime,
    transportTypes: formData.transportTypes,
    budget: formData.budget,
    preferences: formData.preferences,
  };

  // LocalStorage에 저장
  localStorage.setItem('travelInput', JSON.stringify(travelInput));

  // 결과 페이지로 이동
  router.push('/result');
}
</script>

<style scoped>
.search-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 2rem;
}

form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

input[type="date"],
input[type="time"],
input[type="number"],
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.checkbox-group {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(59, 130, 246, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .checkbox-group {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
