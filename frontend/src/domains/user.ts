export type interfaceUser = {
  userName: string;
  userId: string;
  roles: string[];
  userDepartment: string;
  description: string;
  userSeq: number;
};

export interface funcUser {
  validate: (errors: Record<string, string>) => void;
}

export class User implements interfaceUser, funcUser {
  userName: string;
  userId: string;
  roles: string[];
  userDepartment: string;
  description: string;
  userSeq: number;
  public validate = (errors: Record<string, string>): void => {
    console.log(`Description > ${this.description}`);
    if (this.description.length > 20) {
      errors["description"] =
        "Description should be cannot exceed a maximum of 20 characters short.";
    }
  };
}
