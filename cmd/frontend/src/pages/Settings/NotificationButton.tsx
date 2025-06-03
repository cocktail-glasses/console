import { useTranslation } from 'react-i18next';

import { ActionButton } from '@components/common';

export default function NotificationButton(props: { onClickExtra?: () => void }) {
  const { onClickExtra } = props;
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ActionButton
      icon="mdi:bell"
      description={t('translation|Notifications')}
      onClick={() => {
        onClickExtra && onClickExtra();
      }}
    />
  );
}
