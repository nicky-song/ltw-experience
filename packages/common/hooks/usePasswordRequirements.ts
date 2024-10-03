export const usePasswordRequirements = (
  newPassword: string,
  confirmPassword: string,
) => {
  const passwordRequirements: [string, boolean][] = [
    ['At least 8 characters long', newPassword.length >= 8],
    [
      'One uppercase and lower case letter',
      newPassword.toLowerCase() != newPassword &&
        newPassword.toUpperCase() != newPassword,
    ],
    ['One special character', /[!@#$%^&*_=+-]/g.test(newPassword)],
    ['One number', /\d/.test(newPassword)],
    ['Password match', newPassword !== '' && newPassword === confirmPassword],
  ];

  const areRequirementsMet = passwordRequirements.every((data) => {
    return data[1];
  });

  return { passwordRequirements, areRequirementsMet };
};
