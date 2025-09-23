# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - heading "로그인" [level=2] [ref=e6]
      - paragraph [ref=e7]: 계정에 로그인하여 서비스를 이용하세요
    - generic [ref=e8]: Email address "demo@example.com" is invalid
    - generic [ref=e9]:
      - button "LinkedIn으로 로그인" [ref=e10] [cursor=pointer]
      - generic [ref=e15]: 또는
      - button "데모로 로그인" [ref=e16] [cursor=pointer]
    - paragraph [ref=e18]:
      - text: 로그인하면
      - link "이용약관" [ref=e19] [cursor=pointer]:
        - /url: "#"
      - text: 과
      - link "개인정보처리방침" [ref=e20] [cursor=pointer]:
        - /url: "#"
      - text: 에 동의하는 것으로 간주됩니다.
  - alert [ref=e21]
```