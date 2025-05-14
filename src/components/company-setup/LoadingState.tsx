
import Logo from "@/components/Logo";

type LoadingStateProps = {
  message?: string;
};

export const LoadingState = ({ message = "Carregando..." }: LoadingStateProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <Logo className="mx-auto mb-4" />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vistoria-blue mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};
