/**
 * 수량 기반 랜덤 추첨
 * remain > 0 인 경품만 대상으로, total 수량 비율에 따라 당첨 항목을 반환합니다.
 * @param {Array} prizes
 * @returns {Object|null} 당첨 경품 또는 null (재고 없음)
 */
export function weightedRandom(prizes) {
  const available = prizes.filter((p) => p.remain > 0);
  if (available.length === 0) return null;

  const totalWeight = available.reduce((sum, p) => sum + p.total, 0);
  let rand = Math.random() * totalWeight;

  for (const prize of available) {
    rand -= prize.total;
    if (rand <= 0) return prize;
  }
  return available[available.length - 1];
}
