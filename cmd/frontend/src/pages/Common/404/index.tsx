import { useTranslation } from 'react-i18next';

import ErrorComponent from '@pages/Common/ErrorPage';
import headlampBrokenImage from 'assets/headlamp-404.svg';

export default function NotFoundComponent() {
  const { t } = useTranslation();
  return <ErrorComponent graphic={headlampBrokenImage as any} title={t("Whoops! This page doesn't exist")} />;
}
