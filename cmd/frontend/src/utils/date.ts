// 날짜 관련 유틸
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const fromNow = (dateObj: dayjs.ConfigType) => dayjs(dateObj).fromNow();
