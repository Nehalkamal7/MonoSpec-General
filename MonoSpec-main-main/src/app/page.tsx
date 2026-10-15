'use client';

import React from 'react';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';
import { UniversalLandingPage } from '@/components/landing/UniversalLandingPage';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { AppShell } from '@/components/layout/AppShell';

export default function Home() {
  const { activeView } = useMonoSpecStore();

  if (activeView === 'landing') {
    return <UniversalLandingPage />;
  }

  if (activeView === 'onboarding') {
    return <OnboardingWizard />;
  }

  return <AppShell />;
}
