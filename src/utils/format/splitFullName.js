export const splitFullName = (fullName) => {
  const words = fullName.trim().split(/\s+/);
  const mid = Math.ceil(words.length / 2);
  const name = words.slice(0, mid).join(' ');
  const lastName = words.slice(mid).join(' ');

  return { name, lastName };
};
