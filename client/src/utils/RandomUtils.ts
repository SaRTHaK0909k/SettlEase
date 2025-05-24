const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  return hasBirthdayPassed ? age : age - 1;
};

const formatBirthday = (input: Date | string | null | undefined): string => {
  if (!input) return "No birthday provided";

  const birthDate = new Date(input);
  if (isNaN(birthDate.getTime())) return "Invalid birthday";

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(birthDate);

  const age = calculateAge(birthDate);
  return `${formattedDate} (${age} years old)`;
};

const getAge = (input: Date | string | null | undefined): number | string => {
  if (!input) return "No birthday provided";

  const birthDate = new Date(input);
  if (isNaN(birthDate.getTime())) return "Invalid birthday";

  return calculateAge(birthDate);
};

export { formatBirthday, getAge };




