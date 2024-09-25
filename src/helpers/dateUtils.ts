export const getWeekNumber = (date: Date): number => {
  const copiedDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNumber = (copiedDate.getUTCDay() + 6) % 7; // Make Monday day 0
  copiedDate.setUTCDate(copiedDate.getUTCDate() - dayNumber + 3);
  const firstThursday = copiedDate.getTime();
  copiedDate.setUTCMonth(0, 1); // Set to January 1
  if (copiedDate.getUTCDay() !== 4) {
    copiedDate.setUTCMonth(0, 1 + ((4 - copiedDate.getUTCDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - copiedDate.getTime()) / 604800000);
};
