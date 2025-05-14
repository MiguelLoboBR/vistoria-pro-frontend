
// Re-export from the new location to maintain backward compatibility
import { RegisterForm as ActualRegisterForm } from "./register/RegisterForm";
import { RegisterFormValues, registerFormSchema } from "./register/schema";

export const RegisterForm = ActualRegisterForm;
export { type RegisterFormValues, registerFormSchema };
