export function validatePassword(password: string) {
  // Regex to enforce the rules
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;

  // Test the password against the regex
  return regex.test(password);
}
