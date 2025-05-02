'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import BankingPage from '@/app/banking/page';

export default function Banking() {
  return (
    <ErrorBoundary>
      <BankingPage />
    </ErrorBoundary>
  );
} 