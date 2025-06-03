import { useTranslation } from 'react-i18next';

import { ActionButton } from '@components/common';

export default function SettingsButton(props: { onClickExtra?: () => void }) {
  const { onClickExtra } = props;
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ActionButton
      icon="mdi:cog"
      description={t('translation|Settings')}
      onClick={() => {
        onClickExtra && onClickExtra();
      }}
    />
  );
}
