/**
 * 사용자 취향 텍스트를 분석하여 키워드 태그로 변환하는 모듈
 *
 * 현재는 더미 로직으로 구현되어 있으며,
 * 나중에 callAiPreference() 함수를 실제 LLM API로 교체할 수 있습니다.
 */

// 키워드 매핑 테이블 (더미)
const KEYWORD_MAPPING: Record<string, string[]> = {
  '카페': ['카페', '커피'],
  '바다': ['바다', '바다뷰', '해변', '오션뷰'],
  '조용': ['조용한', '힐링', '평화'],
  '인스타': ['인스타감성', '감성', '예술', '색채'],
  '맛집': ['맛집', '식당', '음식'],
  '관광': ['관광지', '명소', '투어'],
  '쇼핑': ['쇼핑', '백화점', '거리'],
  '자연': ['자연', '산책', '등산'],
  '힙': ['힙한', '트렌디', '모던'],
  '전통': ['전통', '역사', '문화'],
  '활기': ['활기찬', '북적', '번화가'],
  '데이트': ['데이트', '로맨틱'],
};

/**
 * 더미 AI 취향 분석 함수
 * 사용자가 입력한 자유 텍스트에서 키워드를 추출합니다.
 *
 * @param preferenceText - 사용자 입력 텍스트 (예: "카페 많이 가고 싶고, 인스타 감성 좋아함, 사람 많은 곳은 싫어")
 * @returns 추출된 키워드 배열 (예: ['카페', '인스타감성', '조용한'])
 */
export function parsePreferences(preferenceText: string): string[] {
  const keywords: string[] = [];
  const lowerText = preferenceText.toLowerCase();

  // 각 키워드 매핑을 확인
  Object.entries(KEYWORD_MAPPING).forEach(([key, tags]) => {
    if (lowerText.includes(key)) {
      keywords.push(...tags);
    }
  });

  // "사람 많은 곳은 싫어" 같은 부정적 키워드 처리
  if (lowerText.includes('사람 많') && lowerText.includes('싫')) {
    keywords.push('조용한');
    // '활기찬' 키워드 제거
    const index = keywords.indexOf('활기찬');
    if (index > -1) {
      keywords.splice(index, 1);
    }
  }

  // 중복 제거
  return Array.from(new Set(keywords));
}

/**
 * 실제 LLM API를 호출하는 함수 인터페이스 (미래 확장용)
 *
 * 사용 예시:
 * const tags = await callAiPreference("카페 좋아하고 조용한 곳 선호");
 *
 * @param preferenceText - 사용자 입력 텍스트
 * @returns Promise<string[]> - AI가 분석한 키워드 배열
 */
export async function callAiPreference(preferenceText: string): Promise<string[]> {
  // TODO: 실제 LLM API 연동 (예: OpenAI, Anthropic Claude API)
  //
  // 예시 구현:
  // const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     model: 'gpt-4',
  //     messages: [{
  //       role: 'user',
  //       content: `다음 여행 취향 텍스트에서 키워드를 추출해주세요: "${preferenceText}"
  //                 가능한 키워드: 카페, 바다뷰, 조용한, 인스타감성, 맛집, 관광지, 자연, 힙한 등
  //                 JSON 배열로만 응답해주세요.`
  //     }]
  //   })
  // });
  // const data = await response.json();
  // return JSON.parse(data.choices[0].message.content);

  // 현재는 더미 로직 사용
  return Promise.resolve(parsePreferences(preferenceText));
}

/**
 * 추출된 키워드와 장소 태그를 매칭하여 점수를 계산
 *
 * @param placeTags - 장소의 태그 배열
 * @param userKeywords - 사용자 선호 키워드 배열
 * @returns 매칭 점수 (0~1 사이 값)
 */
export function calculateMatchScore(placeTags: string[], userKeywords: string[]): number {
  if (userKeywords.length === 0) return 0.5; // 중립

  let matchCount = 0;
  placeTags.forEach(tag => {
    if (userKeywords.includes(tag)) {
      matchCount++;
    }
  });

  return matchCount / userKeywords.length;
}
