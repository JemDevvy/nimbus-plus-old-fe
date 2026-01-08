// Validate text input based on rules (length, allowed characters, etc.)
export function validateText(
  input: string,
  options?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  }
): { valid: boolean; error?: string } {

  if (options?.minLength && input.length < options.minLength) {
    return { valid: false, error: `Minimum ${options.minLength} characters required.` };
  }

  if (options?.maxLength && input.length > options.maxLength) {
    return { valid: false, error: `Maximum ${options.maxLength} characters allowed.` };
  }

  if (options?.pattern && !options.pattern.test(input)) {
    return { valid: false, error: `Invalid format. ` };
  }

  return { valid: true };
}
