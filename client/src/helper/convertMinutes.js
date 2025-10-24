import moment from "moment";

export const convertMinutes = (minutes) => {
  if (!minutes && minutes !== 0) return "";

  const duration = moment.duration(minutes, "minutes");
  const hours = Math.floor(duration.asHours());
  const mins = duration.minutes();

  let result = [];

  if (hours > 0) result.push(`${hours}h`);
  if (mins > 0) result.push(`${mins}m`);

  // Fallback: if both are 0 (e.g., invalid input)
  if (result.length === 0) result.push("0m");

  return result.join(" ");
};
