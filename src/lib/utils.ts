/**
 * 새로운 시간 형식으로 날짜를 포맷합니다.
 * 
 * @param dateString 포맷할 날짜 문자열
 * @returns 포맷된 시간 문자열
 */
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  
  // 밀리초를 분/시간/일로 변환
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)
  
  // 방금: 현 시점 기준 10분 이내
  if (diffMinutes < 10) {
    return '방금'
  }
  
  // 10~60분 미만: N분 이전
  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`
  }
  
  // 1시간에서 24시간 미만: N시간 전
  if (diffHours < 24) {
    return `${diffHours}시간 전`
  }
  
  // 1일에서 7일 미만: N일 전
  if (diffDays < 7) {
    return `${diffDays}일 전`
  }
  
  // 1주에서 4주 미만: N주 전
  if (diffWeeks < 4) {
    return `${diffWeeks}주 전`
  }
  
  // 1개월에서 12개월 전: N개월 전
  if (diffMonths < 12) {
    return `${diffMonths}개월 전`
  }
  
  // 1년 이상: N년 N월 N일
  if (diffYears >= 1) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}년 ${month}월 ${day}일`
  }
  
  return date.toLocaleDateString('ko-KR')
}

/**
 * 사용자 이름을 "성 이름" 형식으로 변환합니다.
 */
export function getDisplayName(name: string): string {
  if (!name || name === '사용자') return name
  const parts = name.split(' ')
  if (parts.length >= 2) {
    // 성과 이름을 바꿔서 표시 (예: "동현 김" -> "김 동현")
    return `${parts[parts.length - 1]} ${parts.slice(0, -1).join(' ')}`
  }
  return name
}
