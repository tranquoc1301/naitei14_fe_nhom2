export const maskEmail = (email: string): string => {
  if (!email || !email.includes("@")) return email;

  const [local, domain] = email.split("@");

  if (local.length <= 2) {
    return `${local.charAt(0)}***@${domain}`;
  }

  return `${local.charAt(0)}***@${domain}`;
};
