export const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; 
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};
  
