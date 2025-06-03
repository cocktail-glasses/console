import { injectable } from "inversify";

import { User } from "@domains/cocktail/user";
import { ApiReq, apiRequest } from "@lib/api/api";
import { UserService } from "./";

@injectable()
export class UserServiceImpl implements UserService {
  private baseUrl = "/api/account";

  public getUsers(clusterSeq: string): Promise<User[]> {
    const method = "GET";
    const path = `${this.baseUrl}/${clusterSeq}/users`;
    return apiRequest(<ApiReq>{ path, method });
  }
  public getUser(clusterSeq: string, seq: string): Promise<User> {
    const method = "GET";
    const path = `${this.baseUrl}/${clusterSeq}/user/${seq}`;
    return apiRequest(<ApiReq>{ path, method });
  }
  public createUser(clusterSeq: string, user: User): Promise<any> {
    const method = "POST";
    const path = `${this.baseUrl}/${clusterSeq}/user`;
    return apiRequest(<ApiReq>{ path, method, body: JSON.stringify(user) });
  }
  public deleteUser(clusterSeq: string, seq: string): Promise<any> {
    const method = "DELETE";
    const path = `${this.baseUrl}/${clusterSeq}/user/${seq}`;
    return apiRequest(<ApiReq>{ path, method });
  }
  public updateUser(clusterSeq: string, user: User): Promise<any> {
    const method = "PUT";
    const path = `${this.baseUrl}/${clusterSeq}/user/${user.userSeq}`;
    return apiRequest(<ApiReq>{ path, method, body: JSON.stringify(user) });
  }
}
