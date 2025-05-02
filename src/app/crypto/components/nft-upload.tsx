import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageUpload } from '@/components/phone/ui/ImageUpload';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NFTUploadProps {
  onSave: (data: { name: string; description: string; imageFile: File }) => Promise<void>;
  className?: string;
}

export function NFTUpload({ onSave, className }: NFTUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleImageUpload = (file: File) => {
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !name) return;

    try {
      setIsUploading(true);
      await onSave({
        name,
        description,
        imageFile
      });
      // Reset form
      setImageFile(null);
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error creating NFT:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className={cn('p-4 bg-black/20 backdrop-blur-sm', className)}>
      <h3 className="text-lg font-semibold text-white/90 mb-4">
        Create New NFT
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ImageUpload
          onImageUpload={handleImageUpload}
          label="Upload NFT Image"
          className="aspect-square w-full max-w-md mx-auto"
        />
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="NFT Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/5 border-white/10 text-white/90"
            required
          />
          <Input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-white/5 border-white/10 text-white/90"
          />
        </div>
        <Button
          type="submit"
          disabled={!imageFile || !name || isUploading}
          className="w-full"
        >
          {isUploading ? 'Creating NFT...' : 'Create NFT'}
        </Button>
        <p className="text-sm text-white/60 text-center">
          Upload your NFT image and provide details.
          <br />
          Recommended size: 1000x1000px
        </p>
      </form>
    </Card>
  );
} 