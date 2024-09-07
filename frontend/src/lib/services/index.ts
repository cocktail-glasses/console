// TEST: ccambo, CocktailUser
//import CocktailUser from '@domains/cocktail/cocktailUser';
// TEST: ccambo, User
import { User } from "@domains/cocktail/user.ts";

export interface UserService {
  // TEST: ccambo, User
  getUsers: (clusterSeq: string) => Promise<User[]>;
  getUser: (clusterSeq: string, seq: string) => Promise<User>;
  createUser: (clusterSeq: string, user: User) => Promise<any>;
  deleteUser: (clusterSeq: string, seq: string) => Promise<any>;
  updateUser: (clusterSeq: string, user: User) => Promise<any>;

  // TEST: ccambo, CocktailUser
  // getUsers: (clusterSeq: string) => Promise<CocktailUser[]>;
  // getUser: (clusterSeq: string, seq: string) => Promise<CocktailUser>;
  // createUser: (clusterSeq: string, user: CocktailUser) => Promise<any>;
  // deleteUser: (clusterSeq: string, seq: string) => Promise<any>;
  // updateUser: (clusterSeq: string, user: CocktailUser) => Promise<any>;
}
