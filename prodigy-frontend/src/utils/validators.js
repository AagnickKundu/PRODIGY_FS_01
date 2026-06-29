export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const hasUpper = (s) => /[A-Z]/.test(s);
export const hasLower = (s) => /[a-z]/.test(s);
export const hasNumber = (s) => /[0-9]/.test(s);
export const hasSpecial = (s) => /[^A-Za-z0-9]/.test(s);

export function passwordStrength(pw) {
  let score = 0;
  if (!pw) return 0;
  if (pw.length >= 8) score++;
  if (hasUpper(pw)) score++;
  if (hasLower(pw)) score++;
  if (hasNumber(pw)) score++;
  if (hasSpecial(pw)) score++;
  return score; // 0..5
}
