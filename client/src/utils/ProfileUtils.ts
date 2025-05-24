const formatBirthday = (birthdayInput: Date | string | null | undefined): string => {
  if (!birthdayInput) return "No birthday provided";

  const birthday = new Date(birthdayInput);
  if (isNaN(birthday.getTime())) return "Invalid birthday";

  const today = new Date();

  // Calculate age
  let age = today.getFullYear() - birthday.getFullYear();
  const hasBirthdayPassedThisYear =
    today.getMonth() > birthday.getMonth() ||
    (today.getMonth() === birthday.getMonth() && today.getDate() >= birthday.getDate());
  if (!hasBirthdayPassedThisYear) age--;

  // Format date
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(birthday);

  return `${formattedDate} (${age} years old)`;
};

export { formatBirthday };
