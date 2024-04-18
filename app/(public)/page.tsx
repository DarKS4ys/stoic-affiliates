import { SignedIn, SignedOut, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser()
  
  if (user) {
    redirect('/dashboard')
  }
  
  return (
    <main className="items-center justify-center min-h-screen flex flex-col gap-y-4">
      <SignedIn>
        Redirecting you to home... 
      </SignedIn>
      <SignedOut>
        Redirecting you to login...
      </SignedOut>
    </main>
  );
}
