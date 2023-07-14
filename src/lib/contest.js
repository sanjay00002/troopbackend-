import moment from 'moment';
import momentTimezone from 'moment-timezone';

export function getContestStatus(contest) {
  const currentDate = momentTimezone.tz('Asia/Kolkata');
  const contestDate = momentTimezone.tz(
    moment(contest.date, 'YYYY-MM-DD'),
    'Asia/Kolkata',
  );

  if (currentDate.format('YYYY-MM-DD') === contestDate.format('YYYY-MM-DD')) {
    // * Can be Live/Upcoming
    // * Get the contest start & end time from category
    const startTime = momentTimezone.tz(
      moment(contest.category.startTime, 'hh:mm:ss'),
      'Asia/Kolkata',
    );
    const endTime = momentTimezone.tz(
      moment(contest.category.endTime, 'hh:mm:ss'),
      'Asia/Kolkata',
    );

    if (startTime.isAfter(currentDate)) {
      // * Upcoming
      return 'upcoming';
    }
    if (startTime.isBefore(currentDate) && endTime.isAfter(currentDate)) {
      // * Live
      return 'live';
    }
    if (endTime.isBefore(currentDate)) {
      return 'completed';
    }
  } else if (currentDate.isBefore(contestDate)) {
    // * Upcoming contest
    return 'upcoming';
  } else if (currentDate.isAfter(contestDate)) {
    // * Completed
    return 'completed';
  }
}
