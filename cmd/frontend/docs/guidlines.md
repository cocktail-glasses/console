# UI 개발 GuidLines

## Naming

### 폴더

- 각 폴더는 `camelCase` 를 사용한다.

### 파일

- 각 파일은 `camelCase` 를 사용한다.

### type, interface, class

- `PascalCase`를 사용한다.
- type 과 interface는 접두사나 접미사등을 사용하지 않는다.
- 클래스는 interface 구현체인 경우는 `Impl` 접미사를 사용한다.

## Domain 구성하기

> Domain 객체는 클라이언트와 서버의 객체 정보를 관리하기 위한 것입니다.

도메인에 선언 가능한 것들은 다음으로 한정합니다. (기타 사항은 협의로 결정)

- 클래스 선언
  - 필드 및 검증 (Validation) 어노테이션
  - 정보 변환 또는 계산을 위한 메서드
- 인스턴스 생성을 위한 함수

### STEP #1, Domain 폴더 구성

> - Domain 폴더는 가능한 Domain 식별을 위한 그룹 개념으로 생성합니다.
> - 그 하위에 폴더는 상황에 따라 그룹 개념으로 생성합니다.
>   예)
>   cocktail - Cocktail에서 자체적으로 사용하는 그룹
>   cocktail/user - Cocktail 자체적인 사용자 그룹
>   k8s - k8s의 객체 그룹
>   k8s/cluster - K8s의 Cluster 그룹

`/src/domains/cocktail` 에 user 폴더 구성

### STEP #2, Domain 클래스 구성

`/src/domains/cocktail/user` 폴더에 다음과 같이 객체를 구성합니다.

```ts
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ValidatableEntity } from '@typedefines/index';

export class User implements ValidatableEntity {
    @IsNotEmpty()
    @IsString()
    userName: string;
    @IsNotEmpty()
    @IsString()
    userId: string;
    @IsNotEmpty()
    @IsString()
    @IsArray()
    roles: string[];
    @IsNotEmpty()
    @IsString()
    userDepartment: string;
    @IsOptional()
    @IsString()
    description: string;
    userSeq: number;

    public customValidation = async () => {
      // if (!this.interests) {
      //   throw [
      //     {
      //       constraints: {
      //         interests: "최소한 한개 이상 선택해야 합니다.",
      //       },
      //     },
      //   ];
      // }
    };
  }
```

## Service 구성하기

> REST API 호출을 위한 서비스 모듈입니다.
> IoC를 통해서 주입되는 형식이므로 `UIContext`를 통해서 사용하게 됩니다.
> 서비스가 그룹화되어 여러 개 존재하거나 너무 많은 서비스들이 존재하게되면 폴더로 그룹화 합니다.

- STEP #1, 서비스 인터페이스 구성

`/src/lib/services/index.ts` 파일에 서비스 인터페이스를 구성합니다.

```ts
export interface UserService {
  getUsers: (clusterSeq: string) => Promise<User[]>;
  getUser: (clusterSeq: string, seq: string) => Promise<User>;
  createUser: (clusterSeq: string, user: User) => Promise<any>;
  deleteUser: (clusterSeq: string, seq: string) => Promise<any>;
  updateUser: (clusterSeq: string, user: User) => Promise<any>;
}
```

- SETP #2, 서비스 구현체 구성

`/src/lib/services/userService.ts` 파일에 인터페이스 구현체를 구성합니다.

```ts
import { injectable } from 'inversify';

import { User } from '@domains/cocktail/user';
import { ApiReq, apiRequest } from '@lib/api/api';
import { UserService } from './';

@injectable()
export class UserServiceImpl implements UserService {
    private baseUrl = "/api/account";

    public getUsers(clusterSeq: string): Promise<User[]> {
        const method = 'GET';
        const path = `${this.baseUrl}/${clusterSeq}/users`;
        return apiRequest(<ApiReq>{path, method})
    }
    public getUser(clusterSeq: string, seq: string): Promise<User> {
        const method = 'GET';
        const path = `${this.baseUrl}/${clusterSeq}/user/${seq}`;
        return apiRequest(<ApiReq>{path, method});
    };
    public createUser(clusterSeq: string, user: User): Promise<any> {
        const method = 'POST';
        const path = `${this.baseUrl}/${clusterSeq}/user`;
        return apiRequest(<ApiReq>{path, method, body: JSON.stringify(user)});
    };
    public deleteUser(clusterSeq: string, seq: string): Promise<any> {
        const method = 'DELETE';
        const path = `${this.baseUrl}/${clusterSeq}/user/${seq}`;
        return apiRequest(<ApiReq>{path, method});
    };
    public updateUser(clusterSeq: string, user: User): Promise<any> {
        const method = 'PUT';
        const path = `${this.baseUrl}/${clusterSeq}/user/${user.userSeq}`;
        return apiRequest(<ApiReq>{path, method, body: JSON.stringify(user)});
    };
}
```

- STEP #3, 서비스 식별자 구성

`/src/lib/constants.ts` 파일에 서비스 식별자를 구성합니다.

```ts
export const SERVICE_INDENTIFIER = {
  User: Symbol.for('UserService'),
};
```

- STEP #4, 서비스 IoC 구성

`/src/config/inversify.config.ts` 파일에 작성한 서비스를 구성합니다.

```ts
import { Container } from 'inversify';

import { SERVICE_INDENTIFIER } from '@lib/constants';
import { UserService } from '@lib/services';
import { UserServiceImpl } from '@lib/services/userService';

const diContainer = new Container({ defaultScope: 'Singleton' });

diContainer.bind<UserService>(SERVICE_INDENTIFIER.User).to(UserServiceImpl);

export default diContainer;
```

- STEP $5, 서비스 사용

`/src/pages/users/list.tsx` 파일에서 다음과 같이 사용합니다.

```tsx
import { SERVICE_INDENTIFIER } from '@lib/constants';
import useUIContext from '@lib/hooks/useUIContext';
import { UserService } from '@lib/services';
...
  const uiContext = useUIContext();
  useEffect(() => {
    uiContext
      .getService<UserService>(SERVICE_INDENTIFIER.User)
      .getUsers('1')
      .then((data) => setUsers(data))
      .catch((err) => alert(err instanceof Error ? err.message : err));
  }, []);
...
```

## Kubernetes 모델 추출 & client 생성

k8s 클러스터 리소스를 모델로 추출하기 위해 openapi-generator를 이용합니다.

### 1. kube api-server proxy

openapi-generator를 이용하기 위해 클러스터의 openapi 명세를 가져올 수 있어야 합니다. 다음을 실행하여 kube api-server에 프록시합니다.

```sh
kubectl proxy
```

### 2. openapi-generator 실행

openapi 스펙은 v2, v3가 존재합니다.

- v2: 클러스터 모든 리소스를 통합한 명세를 제공합니다.

- v3: 클러스터 그룹/버전 별로 명세를 제공합니다.

다음을 실행하여 k8s 모델과 client를 생성할 수 있습니다.

```sh
# input: http://localhost:8001/openapi/v2, output: ./gen
npm run gen

# input: http://localhost:8001/openapi/v3/apis/kamaji.clastix.io/v1alpha1, output: ./gen
npm run gen -- version=v3 api=kamaji.clastix.io/v1alpha1

# input: http://cocktail.io/openapi/v3/apis/kamaji.clastix.io/v1alpha1, output: ./gen
npm run gen -- version=v3 api=kamaji.clastix.io/v1alpha1 url=http://cocktail.io

```

가능한 인자는 다음과 같습니다.
|인자|설명|기본값|
|------|---|---|
|generator| 사용할 제너레이터|typescript-axios|
|url|입력 소스 url|http://localhost:8001|
|version|입력 소스 url; [v2\|v3]|v2|
|api|클러스터 리소스 그룹 버전 ex. kamaji.clastix.io/v1alpha1||
|output|추출된 결과 디렉터리 경로|./gen|

### 3. 모델 & client 추출

명령을 실행하면 결과 디렉터리가 생성됩니다. 결과 디렉터리에서 `api.ts`, `base.ts`, `common.ts`, `configuration.ts`, `index.ts` 파일을 `src/lib/[model-name]/` 경로에 복사합니다.

> **Note**
> 추출되는 결과물은 제너레이터에 따라 다릅니다. typescript-axios를 기준으로 작성했습니다.

## kamaji 호출 예제

```typescript
import { KamajiClastixIoV1alpha1Api as KamajiAPI, Configuration } from '@lib/kamaji';
import { AxiosError } from 'axios';

const kamajiConf = new Configuration({
  basePath: 'http://localhost:8001',
});

const kamajiApi = new KamajiAPI(kamajiConf);
kamajiApi
  .listKamajiClastixIoV1alpha1NamespacedTenantControlPlane('tenant-root')
  .then((res) => res.data)
  .then((res) => res.items)
  .then((res) => console.log(res))
  .catch((e: AxiosError) => console.log(e.message));
```

## CSS Module

기본적으로 전역 스코프인 css를 css 파일별로 로컬 스코프로 변환해주는 기술입니다.

### css module 적용

#### css 파일명 변경

작성한 css 또는 scss 파일을 모듈화하려면 .module 을 붙여줘야 합니다.

```bash
[모듈명].module.css
# or
[모듈명].module.scss

# example
table.module.css # table.css
```

#### css module 임포트

변환된 클래스명을 html에 주입하려면 다음과 같이 임포트하여 사용합니다.

```tsx
import style from './table.module.scss'

...

return (
  <div className={style['table-container']}></div>
)
```

### css 클래스명 camelCase로 변경

개별 편의성을 위해 클래스명을 camelCase로 변환하여 사용할 수 있습니다.

```js
// vite.config.ts
...

// camelCase를 인식하도록 빌드 설정 추가
css: {
    modules: {
      localsConvention: 'camelCase',
    },
},
```

```tsx
import style from './table.module.scss'

...
return (
  <div className={style.tableContainer}></div>
)
```

### vscode css module 패키지

css 모듈을 사용하여 개발할때 자동완성을 지원합니다.

camelCase 자동완성을 설정하려면 다음 순서대로 설정을 변경합니다.

1. vscode 설정 탭을 연다.
2. CSS Module: Camel case를 검색한다.
3. Edit in settings.json을 클릭한다.
4. 설정값을 false에서 true로 변경한다.

```js
{
  "cssModules.camelCase": true
}
```

만약 자동완성이 camelCase로 보이지 않는다면 vscode를 재시작합니다.

### css 모듈에서 전역 클래스 사용

css 모듈에 표현된 클래스 중 외부(전역 css) 클래스임을 나타내야 하는 경우가 존재합니다.

```scss
.dark {
  .table {
    border: '1px solid white';
  }
}
```

위 스타일 코드에서 `dark` 클래스는 공통으로 사용되는 클래스입니다. 이런 경우 `:global` 를 사용하여 `.dark` 클래스는 전역 클래스임을 나타내어 변환되지 않도록 만들어 줍니다.

```scss
:global(.dark) {
  .table {
    border: '1px solid white';
  }
}

// 아래와 동일

.dark {
  .[file-name]__table__[hash-value] {
    border: '1px solid white';
  }
}
```

괄호 없이 사용된다면 해당 스코프를 전역 클래스로 사용합니다. 만약 전역 스코프 내부에서 로컬 클래스임을 나타내고 싶다면 `:local` 를 사용하여 로컬 클래스임을 나타내고 변환하도록 만들어 줍니다.

```scss
:global .dark {
  // 해당 영역은 전역 클래스 스코프

  :local(.table) {
    // .table 클래스는 로컬 클래스이므로 .파일명__table__해시값 클래스로 변환됩니다.
    border: '1px solid white';
  }
}

:global .dark {
  // 해당 영역은 전역 클래스 스코프

  :local {
    // 해당 영역은 로컬 클래스 스코프, 이 영역에 표시된 클래스는 모두 로컬 클래스이므로 변환됩니다.
    .table {
      border: '1px solid white';
    }
  }
}
```
