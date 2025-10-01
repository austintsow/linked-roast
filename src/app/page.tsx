'use client';

import { Flame, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/api/auth/linkedin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Flame className="h-12 w-12 text-orange-500" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text">
            linkedRoast
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Get your LinkedIn profile roasted by AI, then receive actionable feedback to level up. No BS, just results.
        </p>
        <div className="flex justify-center">
          <Button
            onClick={handleLogin}
            size="lg"
            className="bg-[#0077B5] hover:bg-[#005582] text-white w-full sm:w-auto min-w-[250px]"
          >
            <Linkedin className="mr-2 h-5 w-5" />
            Sign in with LinkedIn
          </Button>
        </div>
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Free forever. Powered by AI. Roasts are humor-only, never harassment.</p>
        </div>
      </div>
    </div>
  );
}
