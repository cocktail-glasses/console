import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { DateLabel } from '@components/common';
import Empty from '@components/common/EmptyContent';
import bellIcon from '@iconify/icons-mdi/bell';
import { Icon } from '@iconify/react';
import { useClustersConf } from '@lib/k8s';
import Event from '@lib/k8s/event';
import { createRouteURL } from '@lib/router';
import {
  defaultMaxNotificationsStored,
  loadNotifications,
  Notification,
  NotificationIface,
  setNotifications,
  updateNotifications,
} from 'redux/notificationsSlice';
import { useTypedSelector } from 'redux/reducers/reducers';

function NotificationsList(props: {
  notifications: NotificationIface[];
  clickEventHandler: (notification?: NotificationIface, closeMenu?: boolean) => void;
}) {
  const { notifications, clickEventHandler } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const config = useTypedSelector((state) => state.config);

  if (!notifications || notifications.length === 0) {
    return <Empty>{t("translation|You don't have any notifications right now")}</Empty>;
  }

  function notificationSeenUnseenHandler(event: any, notification?: NotificationIface) {
    event.stopPropagation();
    if (!notification) {
      return;
    }
    clickEventHandler(notification);
  }

  function notificationItemClickHandler(notification: NotificationIface) {
    notification.url && navigate(notification.url);
    clickEventHandler(notification, true);
  }

  function Row(props: ListChildComponentProps) {
    const { index, style } = props;
    const notification = notifications[index];
    if (notification.deleted) {
      return null;
    }

    return (
      <ListItem
        button
        key={`${notification}__${index}`}
        sx={{
          '&.MuiMenuItem-root': {
            borderBottom: `1px solid ${theme.palette.notificationBorderColor}`,
            padding: '1rem',
          },
        }}
        style={style}
      >
        <Grid
          container
          justifyContent="space-between"
          spacing={1}
          onClick={() => notificationItemClickHandler(notification)}
        >
          <Grid item md={notification.seen ? 11 : 10}>
            <Tooltip title={notification.message || t('translation|No message')}>
              <Typography style={{ fontWeight: notification.seen ? 'normal' : 'bold' }} noWrap>
                {`${notification.message || t('translation|No message')}`}
              </Typography>
            </Tooltip>
          </Grid>
          {!notification.seen && (
            <Grid item md={1}>
              <Tooltip title={t('translation|Mark as read')}>
                <IconButton
                  onClick={(e) => notificationSeenUnseenHandler(e, notification)}
                  aria-label={t('translation|Mark as read')}
                  size="medium"
                >
                  <Icon icon="mdi:circle" color={theme.palette.error.main} height={12} width={12} />
                </IconButton>
              </Tooltip>
            </Grid>
          )}
          <Grid item md={12}>
            <Box display={'flex'} alignItems="center">
              {Object.entries(config?.clusters || {}).length > 1 && notification.cluster && (
                <Box border={1} p={0.5} mr={1} textOverflow="ellipsis" overflow={'hidden'} whiteSpace="nowrap">
                  {notification.cluster}
                </Box>
              )}
              <DateLabel date={notification.date} />
            </Box>
          </Grid>
        </Grid>
      </ListItem>
    );
  }

  return (
    <FixedSizeList itemCount={notifications?.length} height={400} itemData={notifications} width="100" itemSize={100}>
      {Row}
    </FixedSizeList>
  );
}

export default function Notifications() {
  const [anchorEl, setAnchorEl] = useState(null);
  const notifications = useTypedSelector((state) => state.notifications.notifications);
  const dispatch = useDispatch();
  const clusters = useClustersConf();
  const warnings = Event.useWarningList(
    Object.values(clusters ?? {})?.map((c) => c.name, {
      queryParams: {
        limit: defaultMaxNotificationsStored,
      },
    })
  );
  const { t } = useTranslation();
  const navigate = useNavigate();
  const maxNotificationsInPopup = 50;

  useEffect(() => {
    const notificationsToShow: NotificationIface[] = [];
    let currentNotifications = notifications;
    let changed = false;

    if (currentNotifications.length === 0) {
      currentNotifications = loadNotifications();
      changed = currentNotifications.length > 0;
    }

    for (const [cluster, warningsInfo] of Object.entries(warnings)) {
      const clusterWarnings = warningsInfo.warnings || [];
      if (clusterWarnings.length === 0) {
        continue;
      }

      clusterWarnings.forEach((event: Event) => {
        const alreadyInNotificationList = !!currentNotifications.find(
          (notification) => notification.id === event.metadata.uid
        );

        if (alreadyInNotificationList) {
          return;
        }

        const message = event.message;
        const date = new Date(event.metadata.creationTimestamp).getTime();
        const notification = new Notification({ message, date, cluster });
        notification.id = event.metadata.uid;
        notification.url = createRouteURL('cluster', { cluster }) + `?eventsFilter=${notification.id}`;

        changed = true;

        const notiJson = notification.toJSON();
        notificationsToShow.push(notiJson);
      });
    }

    // It's important to dispatch only if something changed, otherwise we will get into an infinite loop.
    if (changed) {
      // we are here means the events list changed and we have now new set of events, so we will notify the store about it
      dispatch(setNotifications(notificationsToShow.concat(currentNotifications)));
    }
  }, [warnings, notifications, dispatch]);

  const [areAllNotificationsInDeleteState, areThereUnseenNotifications, filteredNotifications] = useMemo(() => {
    const allindelete = notifications.filter((notification) => !notification.deleted).length === 0;
    return [
      allindelete,
      notifications.filter((notification) => notification.seen !== true).length > 0,
      allindelete ? [] : notifications.slice(0, maxNotificationsInPopup),
    ];
  }, [notifications]);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleNotificationMarkAllRead() {
    const massagedNotifications = notifications.map((notification) => {
      const updatedNotification = Object.assign(new Notification(), notification);
      updatedNotification.seen = true;
      return updatedNotification;
    });
    dispatch(setNotifications(massagedNotifications));
  }

  function handleNotificationClear() {
    const massagedNotifications = notifications.map((notification) => {
      const updatedNotification = Object.assign(new Notification(), notification);
      updatedNotification.deleted = true;
      return updatedNotification;
    });
    dispatch(setNotifications(massagedNotifications));
  }

  function menuItemClickHandler(notification?: NotificationIface, closeMenu?: boolean) {
    if (notification) {
      dispatch(updateNotifications(notification));
    }
    if (closeMenu) {
      setAnchorEl(null);
    }
  }

  const notificationMenuId = 'notification-menu';
  const show = Boolean(anchorEl);

  return (
    <>
      <IconButton
        aria-label={t('translation|Show notifications')}
        aria-controls={show ? notificationMenuId : ''}
        aria-haspopup="true"
        onClick={handleClick}
        size="medium"
      >
        {!areAllNotificationsInDeleteState && areThereUnseenNotifications ? (
          <Badge variant="dot" color="error">
            <Tooltip title={`${t('translation|You have unread notifications')}`}>
              <Icon icon={bellIcon} />
            </Tooltip>
          </Badge>
        ) : (
          <Icon icon={bellIcon} />
        )}
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        keepMounted={false}
        open={show}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            width: '30vw',
            minWidth: '300px',
            maxHeight: '70vh',
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        id={notificationMenuId}
      >
        <Box
          sx={(theme) => ({
            borderBottom: `1px solid ${theme.palette.notificationBorderColor}`,
            padding: theme.spacing(1),
          })}
        >
          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Grid item>
              <Box mx={1}>
                <Typography style={{ fontWeight: 'bold' }}>{t('translation|Notifications')}</Typography>
              </Box>
            </Grid>
            <Grid item>
              <Button
                sx={{
                  textTransform: 'none',
                  paddingTop: 0,
                }}
                color="primary"
                onClick={handleNotificationMarkAllRead}
                disabled={areAllNotificationsInDeleteState || !areThereUnseenNotifications}
              >
                {t('translation|Mark all as read')}
              </Button>
              <Button
                sx={{
                  textTransform: 'none',
                  paddingTop: 0,
                }}
                color="primary"
                onClick={handleNotificationClear}
                disabled={areAllNotificationsInDeleteState}
              >
                {t('translation|Clear')}
              </Button>
            </Grid>
          </Grid>
        </Box>
        <NotificationsList notifications={filteredNotifications} clickEventHandler={menuItemClickHandler} />
        <Button
          fullWidth
          color="primary"
          onClick={() => {
            navigate('/notifications');
            setAnchorEl(null);
          }}
          style={{ textTransform: 'none' }}
        >
          {t('translation|View all notifications')}
        </Button>
      </Popover>
    </>
  );
}
