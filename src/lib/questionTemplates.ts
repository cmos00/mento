import { QuestionTemplate } from '@/types'

export const questionTemplates: QuestionTemplate[] = [
  {
    id: 'career-transition',
    title: '이직 및 커리어 전환',
    description: '현재 직장에서 새로운 기회로의 전환을 고려하고 있습니다.',
    category: 'career-transition',
    fields: [
      {
        name: 'currentRole',
        label: '현재 직무',
        type: 'text',
        required: true,
        placeholder: '예: 소프트웨어 엔지니어, 마케팅 매니저'
      },
      {
        name: 'targetRole',
        label: '목표 직무',
        type: 'text',
        required: true,
        placeholder: '예: 프로덕트 매니저, 데이터 사이언티스트'
      },
      {
        name: 'experience',
        label: '현재 경력',
        type: 'select',
        required: true,
        options: ['1-2년', '3-5년', '6-8년', '9년 이상']
      },
      {
        name: 'motivation',
        label: '전환을 고려하는 이유',
        type: 'textarea',
        required: true,
        placeholder: '전환을 고려하게 된 구체적인 이유와 상황을 설명해주세요.'
      },
      {
        name: 'challenges',
        label: '현재 겪고 있는 어려움',
        type: 'textarea',
        required: false,
        placeholder: '전환 과정에서 겪고 있거나 예상되는 어려움을 설명해주세요.'
      },
      {
        name: 'timeline',
        label: '전환 계획 시기',
        type: 'select',
        required: true,
        options: ['즉시', '3개월 내', '6개월 내', '1년 내', '1년 이상']
      }
    ],
    examples: [
      '현재 IT 회사에서 5년간 개발자로 일하고 있는데, 프로덕트 매니저로 전환하고 싶습니다.',
      '마케팅 업무를 3년간 해왔는데, 데이터 분석 분야로 전환하고 싶습니다.',
      '대기업에서 스타트업으로의 전환을 고려하고 있습니다.'
    ]
  },
  {
    id: 'workplace-conflict',
    title: '직장 내 갈등 및 인간관계',
    description: '직장에서 동료나 상사와의 관계에서 어려움을 겪고 있습니다.',
    category: 'workplace-conflict',
    fields: [
      {
        name: 'conflictType',
        label: '갈등 유형',
        type: 'select',
        required: true,
        options: ['동료와의 갈등', '상사와의 갈등', '팀 간 갈등', '업무 방식 차이', '기타']
      },
      {
        name: 'situation',
        label: '구체적인 상황',
        type: 'textarea',
        required: true,
        placeholder: '언제, 어디서, 누구와 어떤 일이 있었는지 구체적으로 설명해주세요.'
      },
      {
        name: 'attempts',
        label: '이미 시도해본 해결 방법',
        type: 'textarea',
        required: false,
        placeholder: '이미 시도해본 대화나 해결 방법이 있다면 설명해주세요.'
      },
      {
        name: 'impact',
        label: '갈등이 업무에 미치는 영향',
        type: 'textarea',
        required: true,
        placeholder: '이 갈등이 업무 성과나 업무 환경에 어떤 영향을 미치고 있나요?'
      },
      {
        name: 'desiredOutcome',
        label: '바라는 결과',
        type: 'textarea',
        required: true,
        placeholder: '이 상황이 어떻게 해결되기를 바라시나요?'
      }
    ],
    examples: [
      '동료가 제 아이디어를 계속 무시하고 다른 방향으로 진행하려고 합니다.',
      '상사가 업무 지시를 명확하게 하지 않아 혼란스럽습니다.',
      '팀 내에서 특정 멤버가 업무를 제대로 수행하지 않아 다른 팀원들의 부담이 늘어나고 있습니다.'
    ]
  },
  {
    id: 'performance-management',
    title: '성과 관리 및 업무 효율성',
    description: '업무 성과 향상과 효율적인 업무 관리를 위한 조언이 필요합니다.',
    category: 'performance-management',
    fields: [
      {
        name: 'currentPerformance',
        label: '현재 성과 상황',
        type: 'textarea',
        required: true,
        placeholder: '현재 업무 성과나 평가 상황을 구체적으로 설명해주세요.'
      },
      {
        name: 'challenges',
        label: '업무에서 겪고 있는 어려움',
        type: 'textarea',
        required: true,
        placeholder: '업무 효율성이나 성과 향상을 방해하는 요소들을 설명해주세요.'
      },
      {
        name: 'goals',
        label: '목표하는 성과 수준',
        type: 'textarea',
        required: true,
        placeholder: '어떤 수준의 성과를 달성하고 싶으신가요?'
      },
      {
        name: 'timeframe',
        label: '목표 달성 기간',
        type: 'select',
        required: true,
        options: ['1개월 내', '3개월 내', '6개월 내', '1년 내', '1년 이상']
      },
      {
        name: 'resources',
        label: '현재 활용 가능한 자원',
        type: 'textarea',
        required: false,
        placeholder: '업무 개선을 위해 활용할 수 있는 도구, 교육, 지원 등을 설명해주세요.'
      }
    ],
    examples: [
      '업무량이 많아 시간 관리가 어렵고, 중요한 업무에 집중하기 어렵습니다.',
      '성과 평가에서 항상 중간 정도의 점수를 받고 있어 더 좋은 평가를 받고 싶습니다.',
      '새로운 업무를 배우는 데 시간이 오래 걸려 업무 효율성이 떨어집니다.'
    ]
  },
  {
    id: 'skill-development',
    title: '스킬 개발 및 학습',
    description: '새로운 스킬을 배우거나 기존 스킬을 향상시키고 싶습니다.',
    category: 'skill-development',
    fields: [
      {
        name: 'currentSkills',
        label: '현재 보유한 스킬',
        type: 'multiselect',
        required: true,
        options: ['프로그래밍', '데이터 분석', '프로젝트 관리', '커뮤니케이션', '리더십', '기타']
      },
      {
        name: 'targetSkills',
        label: '개발하고 싶은 스킬',
        type: 'multiselect',
        required: true,
        options: ['프로그래밍', '데이터 분석', '프로젝트 관리', '커뮤니케이션', '리더십', '기타']
      },
      {
        name: 'motivation',
        label: '스킬 개발 동기',
        type: 'textarea',
        required: true,
        placeholder: '왜 이 스킬을 개발하고 싶으신가요?'
      },
      {
        name: 'currentLevel',
        label: '현재 스킬 수준',
        type: 'select',
        required: true,
        options: ['초급', '중급', '고급']
      },
      {
        name: 'targetLevel',
        label: '목표 스킬 수준',
        type: 'select',
        required: true,
        options: ['중급', '고급', '전문가']
      },
      {
        name: 'timeAvailable',
        label: '학습에 투자할 수 있는 시간',
        type: 'select',
        required: true,
        options: ['주 1-2시간', '주 3-5시간', '주 6-10시간', '주 10시간 이상']
      }
    ],
    examples: [
      '현재 마케팅 업무를 하고 있는데, 데이터 분석 스킬을 키워 업무에 활용하고 싶습니다.',
      '프로젝트 매니저가 되고 싶어서 리더십과 커뮤니케이션 스킬을 향상시키고 싶습니다.',
      'IT 업계로 전환하고 싶어서 프로그래밍 기초를 배우고 있습니다.'
    ]
  }
]

export const getTemplateByCategory = (category: string): QuestionTemplate | undefined => {
  return questionTemplates.find(template => template.category === category)
}

export const getAllTemplates = (): QuestionTemplate[] => {
  return questionTemplates
}
