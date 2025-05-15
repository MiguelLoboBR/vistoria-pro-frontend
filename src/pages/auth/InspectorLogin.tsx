
import { LoginForm } from "@/components/auth/LoginForm";

const InspectorLogin = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <LoginForm role="inspector" />
      </div>
    </div>
  );
};

export default InspectorLogin;
