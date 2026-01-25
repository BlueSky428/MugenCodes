export interface ValidationError {
  field: string;
  message: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export function validateEmail(email: string): string | null {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
}

export function validateProjectName(name: string): string | null {
  if (!name || name.trim().length === 0) return "Project name is required";
  if (name.trim().length < 3) return "Project name must be at least 3 characters";
  if (name.trim().length > 100) return "Project name must be less than 100 characters";
  return null;
}

export function validateRequirements(requirements: string): string | null {
  if (!requirements || requirements.trim().length === 0) return "Requirements are required";
  if (requirements.trim().length < 20) return "Requirements must be at least 20 characters";
  if (requirements.trim().length > 5000) return "Requirements must be less than 5000 characters";
  return null;
}

export function validateCost(cost: string): string | null {
  if (!cost) return "Development cost is required";
  const numCost = parseFloat(cost);
  if (isNaN(numCost)) return "Please enter a valid number";
  if (numCost <= 0) return "Cost must be greater than 0";
  if (numCost > 10000000) return "Cost must be less than $10,000,000";
  return null;
}

export function validateDeadline(deadline: string): string | null {
  if (!deadline) return "Deadline is required";
  const date = new Date(deadline);
  if (isNaN(date.getTime())) return "Please enter a valid date";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return "Deadline must be in the future";
  return null;
}

export function validateContactPayload(payload: ContactPayload): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate name
  if (!payload.name || payload.name.trim().length === 0) {
    errors.push({ field: "name", message: "Name is required" });
  } else if (payload.name.trim().length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters" });
  } else if (payload.name.trim().length > 100) {
    errors.push({ field: "name", message: "Name must be less than 100 characters" });
  }

  // Validate email
  const emailError = validateEmail(payload.email);
  if (emailError) {
    errors.push({ field: "email", message: emailError });
  }

  // Validate message
  if (!payload.message || payload.message.trim().length === 0) {
    errors.push({ field: "message", message: "Message is required" });
  } else if (payload.message.trim().length < 10) {
    errors.push({ field: "message", message: "Message must be at least 10 characters" });
  } else if (payload.message.trim().length > 5000) {
    errors.push({ field: "message", message: "Message must be less than 5000 characters" });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
