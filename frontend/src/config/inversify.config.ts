import { Container } from "inversify";

import { SERVICE_INDENTIFIER } from "@lib/constants.ts";
import { UserService } from "@lib/services";
import { UserServiceImpl } from "@lib/services/userService.ts";
import UtilClass from "@utils/index.ts";

const diContainer = new Container({ defaultScope: "Singleton" });

// Utility Class
diContainer.bind(UtilClass).to(UtilClass);

// TODO: ccambo, 여기에 사용할 서비스를 등록합니다.
diContainer.bind<UserService>(SERVICE_INDENTIFIER.User).to(UserServiceImpl);

export default diContainer;
