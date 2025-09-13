import moment from "moment";

export const convertMinutes = (minutes) => {
  const duration = moment.duration(minutes, "minutes");
  const hours = Math.floor(duration.asHours());
  const mins = duration.minutes();
  return `${hours}h ${mins}m`;
};
