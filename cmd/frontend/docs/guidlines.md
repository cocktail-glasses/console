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
