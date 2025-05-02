import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageUpload } from '@/components/phone/ui/ImageUpload';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CardCustomizationProps {
  accountId: string;
  onSave: (imageFile: File) => Promise<void>;
  className?: string;
}

export function CardCustomization({ accountId, onSave, className }: CardCustomizationProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      await onSave(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className={cn('p-4 bg-black/20 backdrop-blur-sm', className)}>
      <h3 className="text-lg font-semibold text-white/90 mb-4">
        Customize Your Card
      </h3>
      <div className="space-y-4">
        <ImageUpload
          onImageUpload={handleImageUpload}
          label="Upload Card Background"
          className="aspect-[1.586/1] w-full max-w-md mx-auto"
        />
        <p className="text-sm text-white/60 text-center">
          Upload a custom background image for your card.
          <br />
          Recommended size: 1586x1000px
        </p>
      </div>
    </Card>
  );
} 