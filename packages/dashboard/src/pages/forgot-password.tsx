import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import { Button } from '@/components/primitives/button';
import { Input } from '@/components/primitives/input';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setPending(true);
    try {
      await api.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      toast.error((err as Error).message || 'Could not send reset email');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 bg-bg-base">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Reset your password
          </h1>
          <p className="text-sm text-text-muted mt-1">
            We'll email you a link to choose a new one.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-md border border-border-default bg-bg-elevated p-4 text-sm text-text-muted space-y-3">
            <p>
              If an account exists for <span className="text-text-primary">{email}</span>,
              a reset link has been sent. The link expires in 60 minutes.
            </p>
            <p className="text-xs">
              Didn't get it? Check your spam folder, or contact your admin if
              this is a self-hosted install without SMTP configured.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={pending}
            />
            <Button
              variant="primary"
              type="submit"
              disabled={pending || !email}
              className="w-full"
            >
              {pending ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
        )}

        <p className="text-xs text-text-muted text-center">
          <Link to="/login" className="text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
