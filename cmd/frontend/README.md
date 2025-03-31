# Console Frontend

---

## Development

### node 버전 관리

node 버전 관리는 nvm을 사용합니다. 현재 위치에서 다음 명령어를 실행하면 동일한 노드 버전으로 프로젝트 환경을 구성합니다.

```sh
nvm use
```

### 로컬 실행 commands:

```sh
npm install        # package 설치
npm run start      # node server 실행
npm run build      # package 빌드
npm run preview    # 빌드 된 내용 확인
npm run build-prod # 상용 빌드 (경로에 static 추가됨)
```

### 칵테일 접속 정보

vite.config.ts 설정

Cocktail Console을 포트포워딩하여 접속합니다.

```js
proxy: {
  '/k8s': {
    target: 'http://localhost:8099', // k8s api 리소스 url
    changeOrigin: true,
    ws: true,
    rewrite: (path) => path.replace(/^\/k8s/, ''),
  },
  '/api': {
    target: 'http://localhost:8099', // cocktail api 리소스 url
    changeOrigin: true,
  },
  '/auth': {
    target: 'http://localhost:8099', // cocktail console 인증 url
    changeOrigin: true,
  },
},
```

### k8s proxy

kubectl proxy

### Directory Structure

```
.
├── build/                      # Built artifacts get put here (e.g. webpack.output)
├── dist/                       # 상용 빌드 코드
├── public                      # Static assets
│   ├── fonts/                  # web fonts
├── src                         # The source code of the application
│   ├── atoms/                  # Atomic desing (원자) (box, button, input...)
│   ├── components/             # React [functional|dumb|stateless] components
│   ├── i18n/                   # 다국어
│   ├── lib/                    # Flowtype declarations would go here, if necessary
│   │   ├── k8s/                # headlamp k8s api
│   │   ├── Layout/             # Top, Sidebar...
│   │   ├── AppContainer.tsx    # react router, layout, 인증
│   │   ├── menu.ts             # menu 데이터
│   │   ├── routes.ts           # routes 데이터
│   │   └── util.js             # Here we combine all our reducers
│   ├── molecules/              # Atomic desing (분자) 원자의 조합
│   ├── organisms/              # Atomic desing (유기체)
│   ├── pages/                  # Application 화면
│   ├── resources/              # Static assets. Some call this `public/`
│   ├── App.tsx                 # 다국어, 테마, error...
│   └── index.jsx               # react 시작점
├── index.html                  # index.html template
├── package.json                #
├── tsconfig.json               # TypeScript 설정
└── vite.config.ts              # vite 설정
```

### VS-CODE

#### Plugin

- ESLint
- Prettier - Code formatter
