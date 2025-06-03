import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import ActionButton from '../ActionButton';
import EditorDialog from './EditorDialog';

import { KubeObject } from '@lib/k8s/cluster';

export interface ViewButtonProps {
  /** The item we want to view */
  item: KubeObject;
  /** If we want to have the view open by default */
  initialToggle?: boolean;
}

function ViewButton({ item, initialToggle = false }: ViewButtonProps) {
  const [toggle, setToggle] = useState(initialToggle);
  const { t } = useTranslation();

  return (
    <>
      <ActionButton
        description={t('translation|View YAML')}
        onClick={() => setToggle(true)}
        icon="mdi:eye"
        // edge="end"
      />
      <EditorDialog item={item.jsonData} open={toggle} onClose={() => setToggle((toggle) => !toggle)} onSave={null} />
    </>
  );
}

export default ViewButton;
