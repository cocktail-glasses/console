import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { DateLabel, Link, SectionBox, SectionFilterHeader, Table } from '@components/common';
import Empty from '@components/common/EmptyContent.tsx';
import { Icon } from '@iconify/react';
import { Notification, NotificationIface, setNotifications, updateNotifications } from 'redux/notificationsSlice.ts';
import { useTypedSelector } from 'redux/reducers/reducers.tsx';

export default function NotificationList() {
  const notifications = useTypedSelector((state) => state.notifications.notifications);
  const clusters = useTypedSelector((state) => state.config.clusters);
  const { t } = useTranslation(['glossary', 'translation']);
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();

  const allNotificationsAreDeleted = useMemo(() => {
    return !notifications.find((notification) => !notification.deleted);
  }, [notifications]);

  const hasUnseenNotifications = useMemo(() => {
    return !!notifications.find((notification) => !notification.deleted && !notification.seen);
  }, [notifications]);

  function notificationSeenUnseenHandler(event: any, notification?: NotificationIface) {
    if (!notification) {
      return;
    }
    dispatch(updateNotifications(notification));
  }

  function clearAllNotifications() {
    const massagedNotifications = notifications.map((notification) => {
      const updatedNotification = Object.assign(new Notification(), notification);
      updatedNotification.deleted = true;
      return updatedNotification;
    });
    dispatch(setNotifications(massagedNotifications));
  }

  function markAllAsRead() {
    const massagedNotifications = notifications.map((notification) => {
      const updatedNotification = Object.assign(new Notification(), notification);
      updatedNotification.seen = true;
      return updatedNotification;
    });
    dispatch(setNotifications(massagedNotifications));
  }

  function notificationItemClickHandler(notification: NotificationIface) {
    notification.url && navigate(notification.url);
    notification.seen = true;
    dispatch(updateNotifications(notification));
  }

  function NotificationActionMenu() {
    const [anchorEl, setAnchorEl] = useState(null);

    function handleClick(event: any) {
      setAnchorEl(event.currentTarget);
    }

    function handleClose() {
      setAnchorEl(null);
    }

    return (
      <>
        <IconButton size="medium">
          <Icon icon="mdi:dots-vertical" onClick={handleClick} />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={markAllAsRead} disabled={!hasUnseenNotifications}>
            <Typography color={'primary'}>{t('translation|Mark all as read')}</Typography>
          </MenuItem>
          <MenuItem onClick={clearAllNotifications} disabled={allNotificationsAreDeleted}>
            <Typography color="primary">{t('translation|Clear all')}</Typography>
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title={t('translation|Notifications')}
          noNamespaceFilter
          actions={[<NotificationActionMenu />]}
        />
      }
      backLink
    >
      {allNotificationsAreDeleted ? (
        <Empty> {t("translation|You don't have any notifications right now")}</Empty>
      ) : (
        <Box
          style={{
            maxWidth: '100%',
          }}
        >
          <Table
            columns={[
              {
                header: t('translation|Message'),
                gridTemplate: 'auto',
                accessorKey: 'message',
                Cell: ({ row: { original: notification } }) => (
                  <Box>
                    <Tooltip
                      title={notification.message || t('translation|No message')}
                      disableHoverListener={!notification.message}
                    >
                      <Typography
                        style={{
                          fontWeight: notification.seen ? 'normal' : 'bold',
                          cursor: 'pointer',
                        }}
                        noWrap
                        onClick={() => notificationItemClickHandler(notification)}
                      >
                        {`${notification.message || t('translation|No message')}`}
                      </Typography>
                    </Tooltip>
                  </Box>
                ),
              },
              {
                header: t('glossary|Cluster'),
                gridTemplate: 'min-content',
                accessorKey: 'cluster',
                Cell: ({ row: { original: notification } }) => (
                  <Box display={'flex'} alignItems="center">
                    {Object.entries(clusters || {}).length > 1 && notification.cluster && (
                      <Box border={0} p={0.5} mr={1} textOverflow="ellipsis" overflow={'hidden'} whiteSpace="nowrap">
                        <Link routeName="cluster" params={{ cluster: `${notification.cluster}` }}>
                          {notification.cluster}
                        </Link>
                      </Box>
                    )}{' '}
                  </Box>
                ),
              },
              {
                header: t('translation|Date'),
                gridTemplate: 'min-content',
                accessorKey: 'date',
                Cell: ({ row: { original: notification } }) => <DateLabel date={notification.date} />,
              },
              {
                header: t('translation|Visible'),
                gridTemplate: 'min-content',
                accessorKey: 'seen',
                Cell: ({ row: { original: notification } }) =>
                  !notification.seen && (
                    <Tooltip title={t('translation|Mark as read')}>
                      <IconButton
                        onClick={(e) => notificationSeenUnseenHandler(e, notification)}
                        aria-label={t('translation|Mark as read')}
                        size="medium"
                      >
                        <Icon icon="mdi:circle" color={theme.palette.error.main} height={12} width={12} />
                      </IconButton>
                    </Tooltip>
                  ),
              },
            ]}
            data={notifications}
          />
        </Box>
      )}
    </SectionBox>
  );
}
