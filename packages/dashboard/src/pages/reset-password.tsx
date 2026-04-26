import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import { Button } from '@/components/primitives/button';
import { Input } from '@/components/primitives/input';

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pending, setPending] = useState(false);

  const tooShort = password.length > 0 && password.length < 8;
  const mismatch = confirm.length > 0 && password !== confirm;
  const canSubmit =
    !!token && password.length >= 8 && password === confirm && !pending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setPending(true);
    try {
      await api.resetPassword(token, password);
      toast.success('Password updated. Sign in with your new password.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error((err as Error).message || 'Could not reset password');
    } finally {
      setPending(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-4 bg-bg-base">
        <div className="w-full max-w-sm space-y-4 text-center">
          <h1 className="text-2xl font-bold text-text-primary">Invalid link</h1>
          <p className="text-sm text-text-muted">
            This reset link is missing its token. Request a new one.
          </p>
          <Link to="/forgot-password" className="text-primary hover:underline text-sm">
            Send a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 bg-bg-base">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Choose a new password
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Minimum 8 characters.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={pending}
            error={tooShort ? 'At least 8 characters' : undefined}
          />
          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={pending}
            error={mismatch ? 'Passwords do not match' : undefined}
          />
          <Button
            variant="primary"
            type="submit"
            disabled={!canSubmit}
            className="w-full"
          >
            {pending ? 'Saving...' : 'Update password'}
          </Button>
        </form>

        <p className="text-xs text-text-muted text-center">
          <Link to="/login" className="text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
