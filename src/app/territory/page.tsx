'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Map, Shield, Users, DollarSign, Target } from 'lucide-react';
import Link from 'next/link';
import { AuthWrapper } from '@/components/auth/AuthWrapper';
import Image from 'next/image';

export default function TerritoryPage() {
  return (
    <AuthWrapper>
      <TerritoryContent />
    </AuthWrapper>
  );
}

function TerritoryContent() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/background2.png"
          alt="Background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/10 via-transparent to-gray-900/10" />
        {/* Radial gradient for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-300 hover:text-gray-100">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-3xl font-serif text-purple-500 drop-shadow-lg">Territory</h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Territory Overview */}
            <Card className="relative overflow-hidden bg-black/50 border border-red-900/30">
              <div className="p-6">
                <h2 className="text-xl font-serif mb-4">Territory Overview</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-red-900/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-900/20 border border-red-900/30 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Defense Level</p>
                        <p className="text-lg font-serif">Medium</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-red-900/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-900/20 border border-red-900/30 flex items-center justify-center">
                        <Users className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Family Members</p>
                        <p className="text-lg font-serif">24</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-red-900/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-900/20 border border-red-900/30 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Daily Income</p>
                        <p className="text-lg font-serif">$5,000</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Territory Actions */}
            <Card className="relative overflow-hidden bg-black/50 border border-red-900/30">
              <div className="p-6">
                <h2 className="text-xl font-serif mb-4">Territory Actions</h2>
                <div className="space-y-4">
                  <Button className="w-full justify-start gap-3 p-4 bg-black/30 border border-red-900/20 hover:bg-red-900/20">
                    <div className="w-10 h-10 rounded-lg bg-red-900/20 border border-red-900/30 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-serif">Defend Territory</p>
                      <p className="text-sm text-gray-400">Protect your turf from rivals</p>
                    </div>
                  </Button>
                  <Button className="w-full justify-start gap-3 p-4 bg-black/30 border border-red-900/20 hover:bg-red-900/20">
                    <div className="w-10 h-10 rounded-lg bg-red-900/20 border border-red-900/30 flex items-center justify-center">
                      <Target className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-serif">Expand Territory</p>
                      <p className="text-sm text-gray-400">Take over new areas</p>
                    </div>
                  </Button>
                  <Button className="w-full justify-start gap-3 p-4 bg-black/30 border border-red-900/20 hover:bg-red-900/20">
                    <div className="w-10 h-10 rounded-lg bg-red-900/20 border border-red-900/30 flex items-center justify-center">
                      <Users className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-serif">Recruit Members</p>
                      <p className="text-sm text-gray-400">Grow your family</p>
                    </div>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Territory Map */}
            <Card className="relative overflow-hidden bg-black/50 border border-red-900/30 md:col-span-2">
              <div className="p-6">
                <h2 className="text-xl font-serif mb-4">Territory Map</h2>
                <div className="relative aspect-video rounded-lg bg-black/30 border border-red-900/20">
                  {/* Placeholder for future map component */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-400">Map visualization coming soon...</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}