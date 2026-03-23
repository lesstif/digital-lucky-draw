# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요
이 문서는 컨퍼런스 벤더 부스용 재고 관리형 디지털 추첨 시스템의 가이드를 제공합니다.
방문객이 버튼을 클릭하면 준비된 경품 재고 내에서 랜덤하게 당첨 결과가 표시되고, 실시간으로 잔여 수량이 차감되는 웹 기반 이벤트 도구입니다.

## 기술 스택
* Framework: React
* Styling: Inline CSS / Styled-components (아이패드 터치 UI 최적화)
* State Management: React useState (브라우저 로컬 스토리지 연동 권장)

## 주요 기능 및 로직
1. 경품 데이터 구조 (Inventory Structure)
JavaScript
const initialPrizes = [
  { id: 1, name: '경품 A', total: 3, remain: 3, weight: 1 },
  { id: 2, name: '경품 B', total: 10, remain: 10, weight: 5 },
  // ... 생략
];
2. 핵심 알고리즘 (Selection Logic)
* 재고 필터링: remain > 0인 항목만 추첨 대상에 포함.
* 랜덤 추출: 필터링된 배열의 length를 기준으로 인덱스 추출.
* 상태 업데이트: 당첨 확정 시 해당 id의 remain 값을 즉시 -1 처리.

3. 화면 구성 요소
* 상단 배너: 종류별 남은 갯수 / 전체 갯수 실시간 표시.
* 중앙 영역: 대형 추첨 버튼 및 당첨 결과 애니메이션.
* 하단 영역: (선택 사항) 당첨 이력 로그 및 관리자 리셋 버튼.

## 개발 가이드라인
실행 및 빌드 (React 기준)
Bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행 (아이패드와 동일 와이파이 접속 후 IP로 접근)
# Vite가 네트워크 IP를 자동 출력합니다
npm run dev

# 프로덕션 빌드
npm run build
주의 사항 (Operational Tips)
데이터 휘발 방지: 브라우저 새로고침 시 데이터가 초기화되지 않도록 useEffect를 사용해 localStorage에 현재 재고 상태를 저장하십시오.

반응형 UI: 아이패드 가로/세로 모드에 대응할 수 있도록 뷰포트(vh, vw) 단위를 활용하십시오.

중복 클릭 방지: 추첨 애니메이션이 진행되는 동안 버튼을 disabled 처리하여 오작동을 방지하십시오.

## 향후 확장 가능성
* 가중치 시스템: 상품별로 당첨 확률을 다르게 설정하는 로직 추가.
* 시각적 효과: 1등 당첨 시 팡파르 효과음 및 컨페티(Confetti) 애니메이션 적용.
* 관리자 모드: 특정 비밀번호 입력 시 재고를 다시 채우는 기능.
