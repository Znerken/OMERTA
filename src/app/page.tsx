'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AuthWrapper } from '@/components/auth/AuthWrapper';

export default function LandingPage() {
  return (
    <AuthWrapper allowAnonymous>
      <LandingContent />
    </AuthWrapper>
  );
}

function LandingContent() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/background.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
      <div className="absolute right-0 top-0 w-[800px] h-screen bg-gradient-to-l from-red-900/5 via-black/0 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto p-8 rounded-lg backdrop-blur-sm bg-black/30 border border-red-900/30 shadow-2xl"
        >
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="mb-4 text-8xl font-bold text-white font-serif tracking-wider">
              OMERTA
            </h1>
            <div className="h-px w-48 bg-gradient-to-r from-transparent via-red-700/50 to-transparent mx-auto" />
            <p className="mt-4 text-2xl text-red-200 font-serif italic tracking-wide">
              "The code of silence that binds the family"
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-12 text-xl text-gray-300 leading-relaxed font-serif"
          >
            Step into the shadows of 1930s America. Build your criminal empire, 
            forge alliances, and rise through the ranks of the most powerful families.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
          >
            <Link href="/login">
              <Button 
                variant="default" 
                size="lg"
                className="group relative w-full sm:w-auto px-8 py-6 text-lg bg-red-900/90 hover:bg-red-800 transition-all duration-300 border border-red-800/50 hover:border-red-700/50 overflow-hidden"
              >
                <motion.div
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent"
                />
                <span>Login</span>
              </Button>
            </Link>
            <Link href="/register">
              <Button 
                variant="outline" 
                size="lg"
                className="group relative w-full sm:w-auto px-8 py-6 text-lg border-red-700/50 text-red-100 hover:bg-red-900/30 transition-all duration-300 overflow-hidden"
              >
                <motion.div
                  animate={{
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent"
                />
                <span>Register</span>
              </Button>
            </Link>
          </motion.div>

          {/* Roadmap Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link href="/roadmap" className="inline-block group">
              <Button 
                variant="link" 
                className="text-red-200/70 group-hover:text-red-200 transition-colors duration-300 text-lg font-serif"
              >
                <span>View Full Development Roadmap</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-0 left-0 right-0 p-4 text-center"
        >
          <p className="text-sm text-gray-500/70">
            © {new Date().getFullYear()} Omerta. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}