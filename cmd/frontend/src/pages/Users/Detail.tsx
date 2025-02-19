import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import BoxBoader from "@components/atoms/Box/BoxBoader";
import {
  ConfirmDialog,
  SectionBox,
  SectionFilterHeader,
} from "@components/common";
import Empty from "@components/common/EmptyContent";
import { Buttons } from "@components/molecules";
import CGFormEdit from "@components/organisms/form/cgFormEdit";
import CGFormView from "@components/organisms/form/cgFormView";
// TEST: ccambo, User
import {
  /*Address, Person,*/
  User,
} from "@domains/cocktail/user";
// TEST: ccambo, CocktailUser
//import CocktailUser, { DefaultValue, FieldOptions } from '@domains/cocktail/cocktailUser';
import { SERVICE_INDENTIFIER } from "@lib/constants";
import useUIContext from "@lib/hooks/useUIContext";
import { UserService } from "@lib/services";
import { CGFieldOption, CGFormOption } from "@typedefines/form";

function Detail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { name } = useParams();
  const [refresh, setRefresh] = useState<number>(0);
  // TEST: ccambo, User
  const [user, setUser] = useState<User>();
  // TEST: ccambo, CocktailUser
  //const [cocktailUser, setCocktailUser] = useState<CocktailUser>(DefaultValue);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const isCreate = name === undefined;
  const [isLoading, setIsLoading] = useState<boolean>(!isCreate);
  const { getService /*, Utils */ } = useUIContext();
  const [dialogProps, setDialogProps] = useState({
    title: "처리 확인",
    description: "",
    onConfirm: () => {},
    handleClose: () => {
      setDialogProps({ ...dialogProps, open: false });
    },
    open: false,
  });

  useEffect(() => {
    // TODO: ccambo, 데이터를 수신한 후에 페이지 렌더링 할 수 있는 방법 필요. 예) Router load + suspense 사용
    if (!isCreate) {
      getService<UserService>(SERVICE_INDENTIFIER.User)
        .getUser("1", name || "")
        .then((data) => {
          // TEST: ccambo, User
          setUser(data);
          // TEST: ccambo, CocktailUser
          //setCocktailUser(data as CocktailUser);
          setIsLoading(false);
        })
        // TODO: 공통 오류 처리
        .catch((err) => alert(err instanceof Error ? err.message : err));
    }
  }, [name, isCreate, refresh, getService]);

  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(data: object) {
    console.log("Submit", data);
    // TODO: ccambo, 데이터 및 로직 검증 필요
    // setDialogProps({
    //   ...dialogProps,
    //   description: `사용자 정보를 ${isCreate ? '등록' : '갱신'}하시겠습니까?`,
    //   onConfirm: () => {
    //     setDialogProps({ ...dialogProps, open: false });
    //     if (isCreate) {
    //       getService<UserService>(SERVICE_INDENTIFIER.User)
    //         // TEST: ccambo, User
    //         .createUser('1', data as User)
    //         // TEST: ccambo, CocktailUser
    //         //.createUser('1', data as CocktailUser)
    //         // TODO: 후처리
    //         .then((_data) => alert('사용자 정보가 등록되었습니다.'))
    //         // TODO: 공통 오류 처리
    //         .catch((err) => alert(err instanceof Error ? err.message : err));
    //     } else {
    //       getService<UserService>(SERVICE_INDENTIFIER.User)
    //         // TEST: ccambo, User
    //         .updateUser('1', data as User)
    //         // TEST: ccambo, CocktailUser
    //         //.updateUser('1', data as CocktailUser)
    //         // TODO: 후처리
    //         .then((_data) => alert('사용자 정보가 갱신되었습니다.'))
    //         // TODO: 공통 오류 처리
    //         .catch((err) => alert(err instanceof Error ? err.message : err));
    //     }
    //   },
    //   open: true,
    // });
  }
  function onSave() {
    formRef.current?.submit();
  }
  function onRemove() {
    // TODO: ccambo, 데이터 및 로직 검증 필요
    // if (user && user.userSeq) {
    //   // TODO: ccambo, 삭제 Confirm 및 처리
    //   setDialogProps({
    //     ...dialogProps,
    //     description: '사용자 정보를 삭제하시겠습니까?',
    //     onConfirm: () => {
    //       setDialogProps({ ...dialogProps, open: false });
    //       getService<UserService>(SERVICE_INDENTIFIER.User)
    //         .deleteUser('1', String(user?.userSeq))
    //         // TODO: 후처리
    //         .then((_data) => alert('사용자 정보가 삭제되었습니다.'))
    //         // TODO: 공통 오류 처리
    //         .catch((err) => alert(err instanceof Error ? err.message : err));
    //     },
    //     open: true,
    //   });
    // }
  }
  function onRefresh() {
    if (isEdit) {
      // 변경은 Reset
      if (formRef.current?.isDirty()) formRef.current?.reset();
    } else {
      // 그외는 재 조회
      setRefresh(refresh + 1);
    }
  }
  function onCancel() {
    // 상세 보기
    if (!isEdit && !isCreate) {
      navigate("/users");
    }
    // 생성 취소
    if (isCreate) {
      setDialogProps({
        ...dialogProps,
        description: "생성을 취소하시겠습니까?",
        onConfirm: () => {
          setDialogProps({ ...dialogProps, open: false });
          navigate("/users");
        },
        open: true,
      });
    }

    // 수정 취소
    if (isEdit) {
      setDialogProps({
        ...dialogProps,
        description: "변경된 내용이 존재합니다. 변경을 취소하시겠습니까?",
        onConfirm: () => {
          setDialogProps({ ...dialogProps, open: false });
          setIsEdit(false);
        },
        open: true,
      });
    }
  }

  const title = isCreate ? "User Create" : "User Detail";

  // TEST: ccambo, User
  const formOption: CGFormOption = {
    schema: User,
    // TODO: DefaultValue를 Async Data 처리로 변경해야 한다.
    initialData: user || new User(),
    title: "기본정보",
    columns: 1,
    validateAfterRender: true,
    validationMode: "onChange",
    submitHandler: onSubmit,
    fields: [
      { name: "userName", label: "이름", type: "text" },
      { name: "userId", label: "아이디", type: "text" },
      { name: "userDepartment", label: "부서", type: "text" },
      { name: "description", label: "설명", type: "text" },
      {
        name: "roles",
        label: "권한",
        type: "select",
        options: [
          { value: "SYSTEM", label: "어드민" },
          { value: "DEVOPS", label: "사용자" },
        ],
      },
      { name: "password", label: "비밀번호", type: "password" },
      { name: "userSeq", label: "식별번호", type: "number", hidden: true },
    ] as CGFieldOption[],
  };

  // TEST: ccambo, CocktailUser
  // const formOption: CGFormOption = {
  //   schema: CocktailUser
  //   initialData: cocktailUser,
  //   title: '기본정보',
  //   columns: 1,
  //   validateAfterRender: true,
  //   validationMode: 'onChange',
  //   submitHandler: onSubmit,
  //   fields: FieldOptions,
  // };

  // TEST: ccambo, Person
  // /**
  //  * Default Values
  //  */
  // const personValues = {
  //   ...Object.assign(new Person(), {
  //     name: 'Morris Chang',
  //     email: 'ccambo@acornsoft.io',
  //     password: '123456',
  //     interests: [4, 5],
  //     gender: 1,
  //     title: 1,
  //     dateOfBirth: new Date(2000, 2, 2),
  //     addresses: [
  //       {
  //         street: '대치동',
  //         city: '강남구',
  //         state: '서울',
  //         zipCode: '111-222',
  //         address: '111-222 서울 강남구 대치동',
  //       },
  //       {
  //         street: '신길동',
  //         city: '영등포구',
  //         state: '서울',
  //         zipCode: '333-444',
  //         address: '333-444 서울 영등포구 신길동',
  //       },
  //     ],
  //     customValidation: async () => {},
  //   }),
  // };

  // const valueFunc = (fieldName: string, fieldValue: any) => {
  //   let val = fieldValue;
  //   console.log(`valueFunc >> ${fieldName}`);
  //   switch (fieldName) {
  //     case 'name':
  //       val = `이 자료는 "${val}" 을 변경하는 함수를 호출한 것입니다.`;
  //       break;
  //     case 'street':
  //       val = `이 자료는 "${val}" 을 변경하는 함수를 호출한 것입니다.`;
  //       break;
  //   }

  //   return val;
  // };
  // const appendFunc = (fieldName: string) => {
  //   switch (fieldName) {
  //     case 'addresses':
  //       return Object.assign(new Address(), {
  //         street: '111',
  //         city: '2222',
  //         state: '',
  //         zipCode: '',
  //         address: '',
  //       });
  //     default:
  //       return {};
  //   }
  // };
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const changeFunc = (fieldName: string, _changeFieldNames: string[], changeFieldValues: any[], _allValues: object) => {
  //   const target = Utils.getLastPath(fieldName, '.');
  //   switch (target) {
  //     case 'title':
  //       return {
  //         data: '',
  //         hidden: changeFieldValues[0] === '3' || false,
  //         options:
  //           changeFieldValues[0] === '1'
  //             ? [
  //                 { label: '남자', value: 1 },
  //                 { label: '여자', value: 2 },
  //                 { label: '그외', value: 3 },
  //               ]
  //             : [
  //                 { label: 'test1', value: 1 },
  //                 { label: 'test2', value: 2 },
  //                 { label: 'test3', value: 3 },
  //               ],
  //       };
  //     case 'address':
  //       return { data: changeFieldValues.join(' '), hidden: false, options: [] };
  //     default:
  //       return { data: '', hidden: false, options: [] };
  //   }
  // };

  // const formOption: CGFormOption = {
  //   title: '기본정보',
  //   columns: 2,
  //   initialData: personValues,
  //   schema: Person, // 수정모드
  //   validateAfterRender: true, // 수정모드
  //   validationMode: 'onChange', // 수정모드
  //   submitHandler: onSubmit, // 수정모드
  //   fields: [
  //     {
  //       name: 'name',
  //       label: '이름',
  //       type: 'text',
  //       hidden: false,
  //       valueFunc: valueFunc,
  //     },
  //     { name: 'email', label: '메일', type: 'email', columnSpan: 2 },
  //     { name: 'password', label: '비밀번호', type: 'password', columnSpan: 2 },
  //     {
  //       name: 'interests',
  //       label: '취미',
  //       type: 'checkbox',
  //       options: [
  //         { label: 'Reading', value: 1 },
  //         { label: 'Traveling', value: 2 },
  //         { label: 'Cooking', value: 3 },
  //         { label: 'Sports', value: 4 },
  //         { label: 'Movie', value: 5 },
  //         { label: 'Shopping', value: 6 },
  //       ],
  //       isArray: true,
  //       columnSpan: 2,
  //       align: 'left',
  //     },
  //     {
  //       name: 'gender',
  //       label: '성별',
  //       type: 'radio',
  //       options: [
  //         { label: 'Male', value: 1 },
  //         { label: 'Female', value: 2 },
  //         { label: 'Other', value: 3 },
  //       ],
  //     },
  //     {
  //       name: 'title',
  //       label: '직급',
  //       type: 'select',
  //       dependsOn: {
  //         fieldNames: ['gender'],
  //         changeFunc: changeFunc,
  //       },
  //       options: [
  //         { label: '사원', value: 1 },
  //         { label: '대리', value: 2 },
  //         { label: '과장', value: 3 },
  //         { label: '차장', value: 4 },
  //         { label: '부장', value: 5 },
  //         { label: '이사', value: 6 },
  //       ],
  //     },
  //     { name: 'dateOfBirth', label: '생년월일', type: 'date' },
  //     {
  //       name: 'addresses',
  //       label: '주소 정보',
  //       type: 'nested',
  //       appendFunc: appendFunc,
  //       fields: [
  //         { name: 'street', label: '동', type: 'text', valueFunc: valueFunc },
  //         { name: 'city', label: '군/구', type: 'text' },
  //         { name: 'state', label: '시', type: 'text' },
  //         { name: 'zipCode', label: '우편번호', type: 'text' },
  //         {
  //           name: 'address',
  //           label: '전체주소',
  //           type: 'text',
  //           readonly: true,
  //           dependsOn: {
  //             fieldNames: ['zipCode', 'state', 'city', 'street'],
  //             changeFunc: changeFunc,
  //           },
  //         },
  //       ],
  //       columnSpan: 2,
  //       isArray: true,
  //     },
  //   ] as CGFieldOption[],
  // };

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title={t(title)}
          noNamespaceFilter
          actions={[
            <Buttons
              remove={isCreate || isEdit ? undefined : () => onRemove()}
              cancel={() => onCancel()}
              refresh={isCreate ? undefined : () => onRefresh()}
              edit={isCreate || isEdit ? undefined : () => setIsEdit(true)}
              save={isCreate || isEdit ? () => onSave() : undefined}
            />,
          ]}
        />
      }
    >
      <ConfirmDialog {...dialogProps} />
      {isLoading ? (
        <Empty>{t("translation|Loading...")}</Empty>
      ) : (
        <BoxBoader>
          {isCreate || isEdit ? (
            <CGFormEdit ref={formRef} formOption={formOption} />
          ) : (
            <CGFormView formOption={formOption} />
          )}
        </BoxBoader>
      )}
    </SectionBox>
  );
}

export default Detail;
