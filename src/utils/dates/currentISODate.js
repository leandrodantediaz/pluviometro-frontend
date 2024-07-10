export const currentISODate = () => {
  const currentDate = new Date();
  const datePart = currentDate.toISOString().split('T')[0];
  return `${datePart}T00:00:00.000`;
};
  
