import {
  IsArray,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

import { ValidatableEntity } from "@typedefines/index.ts";
import { Type } from "class-transformer";

/**=========================================================================
 * CGForm User
 *=========================================================================*/

export class User implements ValidatableEntity {
  @IsNotEmpty()
  userName: string;
  @IsNotEmpty()
  userId: string;
  @IsNotEmpty()
  // TODO: class-validator, 문자열 배열 설정 검토
  roles: string[];
  userDepartment: string;
  @IsOptional()
  description: string;
  // TODO: class-validator, 특정 경우에 필수적인 설정 검토
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

// import { ValidatableEntity } from "@typedefines/index";
// import { Type } from "class-transformer";
// import {
//   IsArray,
//   IsDate,
//   IsEmail,
//   IsNotEmpty,
//   IsNumber,
//   IsOptional,
//   IsString,
//   ValidateNested,
// } from "class-validator";

export class Address {
  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  //@IsNotEmpty()
  address: string; // 입력 연계용.
}

export class Person implements ValidatableEntity {
  @IsNotEmpty({ message: "이름은 필수입니다." })
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsArray()
  interests?: number[];

  @IsOptional()
  gender?: number;

  @IsNotEmpty()
  @IsNumber()
  title: number;

  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Address)
  addresses?: Array<Address>;

  public customValidation = async () => {
    if (!this.interests) {
      throw [
        {
          constraints: {
            interests: "최소한 한개 이상 선택해야 합니다.",
          },
        },
      ];
    } else if (this.interests.length < 1) {
      throw [
        {
          constraints: {
            interests: "최소한 1개는 선택해야 합니다.",
          },
        },
      ];
    } else if (this.interests.length > 3) {
      throw [
        {
          constraints: {
            interests: "3개까지만 선택 가능합니다.",
          },
        },
      ];
    } else if (this.addresses && this.addresses.length < 1) {
      throw [
        {
          constraints: {
            addresses: "최소한 한 개의 주소는 등록하셔야 합니다.",
          },
        },
      ];
    }
  };
}
