/**
 * 경품 초기 데이터
 * name과 total만 설정하세요. 가중치는 total 값에서 자동 계산됩니다.
 * (수량이 많을수록 당첨 확률이 높아집니다)
 */
export const initialPrizes = [
  { id: 1, name: '1등 경품', total: 2  },
  { id: 2, name: '2등 경품', total: 5  },
  { id: 3, name: '3등 경품', total: 10 },
  { id: 4, name: '참가상',   total: 30 },
  { id: 5, name: '왕대박',   total: 50 },
].map((p) => ({ ...p, remain: p.total }));
