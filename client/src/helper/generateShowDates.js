import moment from "moment";

export const generateShowDates = () => {
  const dates = Array.from({ length: 7 }, (_, i) =>
    moment().add(i + 1, "days"),
  );

  const days = [];

  dates.forEach((d) => {
    const dayObj = {
      date: d.format("Do"),
      month: d.format("MMM"),
      week: d.format("ddd"),
      value: moment(d).format("YYYYMMDD"),
    };
    days.push(dayObj);
  });

  return days;
};
