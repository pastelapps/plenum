import { Suspense } from 'react';
import LoginForm from '@/components/admin/LoginForm';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 text-gray-900">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Painel Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Instituto Plenum Brasil</p>
        </div>

        <Suspense fallback={
          <div className="bg-white rounded-xl border p-6 shadow-sm space-y-4 animate-pulse">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
