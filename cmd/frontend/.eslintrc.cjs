module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin', 'react-refresh', 'prettier'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    // 검증이 필요한 설정 (typescript any)
    '@typescript-eslint/no-explicit-any': 'off',
    // 검증이 필요한 설정 (import React, { ReactElement } from 'react' 설정 안함)
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // 검증이 필요한 설정
    '@typescript-eslint/ban-types': [
      'error',
      {
        extendDefaults: true,
        types: {
          //(Don't use '{}' as a type. '{}' actually means 'any non-nullish value')
          '{}': false,
        },
      },
    ],
  },
};
// module.exports = {
//   root: true,
//   env: { browser: true, es2020: true },
//   // 기존 config, plugin 들을 사용하면서 확장
//   extends: [
//     'eslint:recommended',
//     'plugin:@typescript-eslint/recommended',
//     'plugin:react-hooks/recommended',
//     'plugin:import/typescript',
//     //'plugin:import/recommended', // import 권장 처리 (errors와 warnings 로 구성됨)
//     'plugin:import/warnings', // errors는 rukes애소 재 정의함
//     'eslint-config-prettier',
//   ],
//   // ESLint 규칙을 제외할 파일들의 이름 패턴 지정 예) src/constants/**/*.ts 등과 같이 작성 가능
//   ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
//   parser: '@typescript-eslint/parser',
//   // rule-set을 제공받아서 정의해서 사용할 경우
//   plugins: ['react-refresh', 'import'], // import는 eslint-plugin-import 용
//   rules: {
//     'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
//     // 상대경로 제외 (오류로 처리), react import 제외
//     // 'no-restricted-imports': [
//     //   'error',
//     //   {
//     //     patterns: ['../*'],
//     //     // React 17 부터 기본으로 import되므로 생략 가능
//     //     paths: [
//     //       {
//     //         name: 'react',
//     //         importNames: ['default'],
//     //         message: "import React from 'react' make bundle size larger",
//     //       },
//     //     ],
//     //   },
//     // ],
//     // import 시에 확장자 명시 (오류로 처리, 라이브러리 패키지 제외)
//     'import/extensions': ['error', 'ignorePackages'],
//     // import 순서 규칙 (방법1 - 권장)
//     // 'sort-imports': [
//     //   'error',
//     //   {
//     //     ignoreCase: false,
//     //     ignoreDeclarationSort: false,
//     //     ignoreMemberSort: false,
//     //     memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
//     //     allowSeparatedGroups: false,
//     //   },
//     // ],
//     // import 순서 규칙 (방법2)
//     'import/order': [
//       'error',
//       {
//         groups: ['builtin', 'external', 'internal', ['sibling', 'parent'], 'index', 'object', 'type', 'unknown'],
//         pathGroups: [
//           {
//             pattern: 'react',
//             group: 'builtin',
//           },
//           {
//             pattern: 'react*',
//             group: 'builtin',
//           },
//           {
//             pattern: 'jotai*',
//             group: 'external',
//           },
//           {
//             pattern: 'inversify*',
//             group: 'external',
//           },
//           {
//             pattern: '@mui*',
//             group: 'external',
//           },
//           {
//             pattern: 'axios*',
//             group: 'external',
//           },
//           {
//             pattern: 'logLevel*',
//             group: 'external',
//           },
//           {
//             pattern: '@*',
//             group: 'internal',
//           },
//           {
//             pattern: '**/*.css',
//             group: 'internal',
//           },
//         ],
//         'newlines-between': 'always',
//         alphabetize: {
//           order: 'asc',
//           caseInsensitive: true,
//         },
//       },
//     ],
//   },
//   settings: {
//     // import 설정
//     'import/resolver': {
//       typescript: {
//         alwaysTryTypes: true, // import 하는 모듈의 `@type/**` 에서 *.d.ts 파일을 찾아서 타입 추론
//         project: './tsconfig.json', // 프로젝트의 tsconfig.json 파일 경로 지정
//         // MonoRepo 등과 같이 여러 개의 tsconfig.json을 운영하는 경우는 아래와 같이 배열로 경로들을 지정한다.
//         // "project": [
//         //   "packages/module-a/tsconfig.json",
//         //   "packages/module-b/tsconfig.json",
//         // ],
//       },
//     },
//   },
// };
