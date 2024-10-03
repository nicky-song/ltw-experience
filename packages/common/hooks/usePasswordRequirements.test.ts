import { usePasswordRequirements } from './usePasswordRequirements';

describe('usePasswordRequirements', () => {
  it('should return true if all requirements are met', () => {
    expect(
      usePasswordRequirements('Password1!', 'Password1!').areRequirementsMet,
    ).toEqual(true);
  });

  it('should return false if no special character', () => {
    const requirements = usePasswordRequirements('Password1', 'Password1');
    expect(requirements.areRequirementsMet).toEqual(false);
    expect(requirements.passwordRequirements[2][1]).toEqual(false);
  });

  it('should return false if no number', () => {
    const requirements = usePasswordRequirements('Password!', 'Password!');
    expect(requirements.areRequirementsMet).toEqual(false);
    expect(requirements.passwordRequirements[3][1]).toEqual(false);
  });

  it('should return false if no uppercase', () => {
    const requirements = usePasswordRequirements('password1!', 'password1!');
    expect(requirements.areRequirementsMet).toEqual(false);
    expect(requirements.passwordRequirements[1][1]).toEqual(false);
  });

  it('should return false if no lowercase', () => {
    const requirements = usePasswordRequirements('PASSWORD1!', 'PASSWORD1!');
    expect(requirements.areRequirementsMet).toEqual(false);
    expect(requirements.passwordRequirements[1][1]).toEqual(false);
  });

  it('should return false if less than 8 characters', () => {
    const requirements = usePasswordRequirements('Pass1!', 'Pass1!');
    expect(requirements.areRequirementsMet).toEqual(false);
    expect(requirements.passwordRequirements[0][1]).toEqual(false);
  });

  it('should return false if passwords do not match', () => {
    const requirements = usePasswordRequirements('Password1!', 'Password2!');
    expect(requirements.areRequirementsMet).toEqual(false);
    expect(requirements.passwordRequirements[4][1]).toEqual(false);
  });
});
