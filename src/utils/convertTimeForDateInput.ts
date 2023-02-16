const convertTimeForDateInput = (time: Date) => {
  const date = time.getDate().toString().padStart(2, '0');
  const month = (time.getMonth() + 1).toString().padStart(2, '0');
  return `${time.getFullYear()}-${month}-${date}`;
};

export default convertTimeForDateInput;
