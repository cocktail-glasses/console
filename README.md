# cocktail-glasses

##Cocktail Glasses 란 ?

---

## Development

### 로컬 실행 commands:

```sh
npm install        # package 설치
npm run start      # node server 실행
npm run buil       # package 빌드
```

### 칵테일 접속 정보

vite.config.ts 설정

```js
proxy: {
  '/headlamp': {
    target: 'http://localhost:4466', // headlamp backend k8s 화면용
    changeOrigin: true,
  },
  '/api': {
    target: 'https://blue-dragon.acloud.run', // cocktail api
    changeOrigin: true,
  },
  '/sso': {
    target: 'https://blue-dragon.acloud.run', // cocktail dashboard 로그인
    changeOrigin: true,
  },
},
```

### Directory Structure

```
.
├── build/                      # Built artifacts get put here (e.g. webpack.output)
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
