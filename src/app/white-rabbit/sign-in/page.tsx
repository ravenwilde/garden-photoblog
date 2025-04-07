import SignInForm from '@/components/forms/SignInForm';

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <SignInForm />
    </div>
  );
}
