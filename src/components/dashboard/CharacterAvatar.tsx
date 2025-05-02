import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { User, Upload } from 'lucide-react';

export default function CharacterAvatar({ 
  profileImage, 
  onUpload 
}: { 
  profileImage: string | null;
  onUpload: () => void;
}) {
  const avatarRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(avatarRef, { once: true });

  return (
    <motion.div
      ref={avatarRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="relative group"
    >
      <div className="relative w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50 ring-4 ring-gray-800/30 shadow-2xl transform-gpu transition-transform duration-300 group-hover:scale-105">
        {profileImage ? (
          <Image
            src={profileImage}
            alt="Profile"
            fill
            className="object-cover transform-gpu transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="relative w-full h-full">
            <Image
              src="/images/male3.png"
              alt="Character"
              fill
              className="object-cover transform-gpu transition-transform duration-300 group-hover:scale-110"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onUpload}
        className="absolute bottom-0 right-0 p-2 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 transition-all shadow-lg transform-gpu"
      >
        <Upload className="w-4 h-4 text-blue-500" />
      </motion.button>

      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      
      {/* Level Badge */}
      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-lg border-2 border-gray-600/50">
        <span className="text-xs font-bold text-yellow-500">1</span>
      </div>
    </motion.div>
  );
} 