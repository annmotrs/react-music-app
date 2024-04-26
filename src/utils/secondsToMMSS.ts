import moment from 'moment';

export default (seconds: number) => moment.utc(seconds * 1000).format('mm:ss');
