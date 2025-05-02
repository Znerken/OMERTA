'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CharacterCreationProvider } from '@/hooks/character/CharacterCreationContext';
import { CharacterCreationStep } from '@/types/character';
import { 
  ArrowLeft, User, Map, Shield, Star, 
  CheckCircle2, XCircle, ChevronRight, ChevronLeft,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { NameInput } from '@/components/character/NameInput';
import { OriginSelection } from '@/components/character/OriginSelection';
import { ClassSelection } from '@/components/character/ClassSelection';
import { TraitsSelection } from '@/components/character/TraitsSelection';
import { StatsAllocation } from '@/components/character/StatsAllocation';
import { CharacterPreview } from '@/components/character/CharacterPreview';
import { useAuth } from '@/hooks/auth/useAuth';

const steps: CharacterCreationStep[] = ['name', 'origin', 'class', 'traits', 'stats', 'preview'];

export default function CreateCharacterPage() {
  const [currentStep, setCurrentStep] = useState<CharacterCreationStep>('name');
  const { signOutAndRedirect } = useAuth();

  const stepComponents = {
    name: <NameInput />,
    origin: <OriginSelection />,
    class: <ClassSelection />,
    traits: <TraitsSelection />,
    stats: <StatsAllocation />,
    preview: <CharacterPreview />
  };

  const currentStepIndex = steps.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  };

  return (
    <CharacterCreationProvider initialStep={currentStep} onStepChange={setCurrentStep}>
      <div className="relative min-h-screen bg-black text-white">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <Image
            src="/images/background.jpg"
            alt="Background"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white hover:text-red-400">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-3xl font-serif text-white drop-shadow-lg">Create Character</h1>
              <Button 
                variant="ghost" 
                className="text-white hover:text-red-400"
                onClick={signOutAndRedirect}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-serif border-2 ${
                        step === currentStep
                          ? 'bg-red-500 text-white border-red-400'
                          : index < currentStepIndex
                          ? 'bg-red-900/50 text-white border-red-900'
                          : 'bg-black/50 text-gray-400 border-gray-800'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-24 h-1 mx-2 ${
                          index < currentStepIndex ? 'bg-red-500' : 'bg-gray-800'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              {stepComponents[currentStep]}
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-12">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={isFirstStep}
                className="text-white hover:text-red-400"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={isLastStep}
                className="bg-red-500 hover:bg-red-600"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CharacterCreationProvider>
  );
}