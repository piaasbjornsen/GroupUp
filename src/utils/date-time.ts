// Receives date in format YYYY-MM-DD and returns a date object
export const stringToDate = (string: string) => {
  if (string === undefined) {
    return null;
  }
  const parts = string.split('-');
  if (parts.length !== 3) {
    return null;
  }
  return new Date(
    parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10)
  );
};

export const dateToString = (date: Date) => {
  return date.toISOString().split('T')[0];
};
