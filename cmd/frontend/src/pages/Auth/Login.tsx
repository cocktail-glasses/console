import { FormEvent } from 'react';
import { FormContainer, PasswordElement, TextFieldElement, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useSetAtom } from 'jotai';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Paper, TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import CocktailCloudLogo from '../../resources/cocktailcloud-logo.svg?react';

import { apiRequest } from '@lib/api/api';
import { cocktailApi } from '@lib/api/constants';
import { authAtom } from '@lib/auth';
import { decryptAESCBC256, encryptAESCBC256 } from '@lib/util';
import { useSnackbar } from 'notistack';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://cocktailcloud.io/">
        Cocktail Cloud
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const formContext = useForm<{
    accountId: string;
    username: string;
    password: string;
  }>({
    defaultValues: {
      accountId: 'MASTER',
      username: 'woon',
      password: 'adminWks@2',
    },
  });
  const { handleSubmit } = formContext;
  const setAuthAtom = useSetAtom(authAtom);
  // const authAtom = atomWithStorage(SESSION_KEY, {});
  async function action(e: any) {
    const p = {
      role: 'DEVOPS',
      loginMode: 'PLATFORM_ADMIN',
    };
    const data = await encryptAESCBC256(
      JSON.stringify({ ...e, ...p }),
      'cocktail-glasses_encryption_data',
      'cocktail-glasses'
    );
    const req = {
      ...cocktailApi.auth.login,
      headers: { 'encryption-body': 'a' },
      // body: JSON.stringify({ ...e, ...p }),
      body: JSON.stringify({ data, loginMode: 'PLATFORM_ADMIN' }),
    };
    apiRequest(req)
      .then((r) => {
        decryptAESCBC256(r, 'cocktail-glasses_encryption_data', 'cocktail-glasses').then((e) => {
          const user = JSON.parse(e);
          setAuthAtom(user);
          navigate(`/`, { replace: true });
        });
      })
      .catch((r) => {
        enqueueSnackbar(r, { variant: 'error' });
        console.log('login catch', r);
      });
  }
  // return (
  //   <Box id="login" sx={{ width: '100%', height: '100%', textAlign: 'center' }}>
  //     <Box sx={{ width: '100%' }}>
  //       <SvgIcon
  //         sx={{ width: 250 }}
  //         // className={className}
  //         component={CocktailCloudLogo}
  //         viewBox="0 0 1111 196"
  //       />
  //     </Box>
  //     <Box sx={{ width: '33%', margin: '0 auto' }}>
  //       <FormContainer formContext={formContext} handleSubmit={handleSubmit(action)}>
  //         <Stack spacing={2}>
  //           <TextFieldElement name={'accountId'} label={'Name'} required />
  //           <TextFieldElement name={'username'} label={'Name'} required />
  //           {/*<TextFieldElement name={'email'} label={'Email'} required type={'email'} />*/}
  //           <PasswordElement
  //             name={'password'}
  //             label={'Password'}
  //             required
  //             // maxLength={3}
  //             rules={{
  //               required: '필수',
  //               maxLength: { value: 30, message: 'max 30' },
  //               minLength: { value: 3, message: 'min 3' },
  //               pattern: {
  //                 value: /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[0-9])(?=\S*[!@#$%^&*\-_=+])\S{9,24}$/,
  //                 message: '잘못',
  //               },
  //             }}
  //           />
  //           <Button type={'submit'} color={'primary'}>
  //             {t('Login')}
  //           </Button>
  //         </Stack>
  //       </FormContainer>
  //     </Box>
  //   </Box>
  // );

  const singin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    action({ accountId: data.get('accountId'), username: data.get('username'), password: data.get('password') });
  };

  return (
    <Grid container component="main" sx={{ height: '100vh', position: 'absolute', top: 0, left: 0 }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url("/static/images/templates/templates-images/sign-in-side-bg.png")',

          backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
          backgroundSize: 'cover',
          backgroundPosition: 'left',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={singin} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="accountId"
              label="Account Id"
              name="accountId"
              autoFocus
            />
            <TextField margin="normal" required fullWidth id="username" label="User name" name="username" />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
