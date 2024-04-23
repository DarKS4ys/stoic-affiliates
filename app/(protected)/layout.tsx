import OnboardingWrapper from '@/components/onboarding/onboarding-wrapper';
import Sidebar from '@/components/sidebar';
import { EdgeStoreProvider } from '@/lib/edgestore';
import { currentUser } from '@clerk/nextjs/server';

export const metadata = {
  title: 'STOIC Affiliates',
  description: 'Generated by Next.js',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  return (
    <EdgeStoreProvider>
      <html lang="en">
        <body>
          <OnboardingWrapper>
            <main className="flex">
              <Sidebar
                firstName={user?.firstName}
                lastName={user?.lastName}
                username={user?.username}
              />
              {children}
            </main>
          </OnboardingWrapper>
        </body>
      </html>
    </EdgeStoreProvider>
  );
}
