import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import * as Dialog from '@radix-ui/react-dialog';
import { Wifi, Bluetooth, Signal, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickSettingsProps {
  open: boolean;
  onClose: () => void;
}

export function QuickSettings({ open, onClose }: QuickSettingsProps) {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [cellular, setCellular] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [volume, setVolume] = useState(75);
  const [brightness, setBrightness] = useState(100);

  const slideAnimation = useSpring({
    transform: open ? 'translateY(0%)' : 'translateY(100%)',
    opacity: open ? 1 : 0,
    config: { tension: 300, friction: 30 }
  });

  return (
    <Dialog.Root open={open} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                onClick={onClose}
              />
            </Dialog.Overlay>
            
            <Dialog.Content asChild>
              <animated.div
                style={slideAnimation}
                className="fixed bottom-0 inset-x-0 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl rounded-t-3xl z-50 p-6 border-t border-white/10"
              >
                {/* Quick Toggles */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setWifi(!wifi)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10",
                      "transition-colors duration-200",
                      wifi && "bg-blue-500/20 border-blue-500/50"
                    )}
                  >
                    <Wifi className={cn("w-6 h-6", wifi ? "text-blue-400" : "text-white/60")} />
                    <span className="text-xs mt-2 font-medium text-white/80">WiFi</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setBluetooth(!bluetooth)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10",
                      "transition-colors duration-200",
                      bluetooth && "bg-blue-500/20 border-blue-500/50"
                    )}
                  >
                    <Bluetooth className={cn("w-6 h-6", bluetooth ? "text-blue-400" : "text-white/60")} />
                    <span className="text-xs mt-2 font-medium text-white/80">Bluetooth</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCellular(!cellular)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10",
                      "transition-colors duration-200",
                      cellular && "bg-blue-500/20 border-blue-500/50"
                    )}
                  >
                    <Signal className={cn("w-6 h-6", cellular ? "text-blue-400" : "text-white/60")} />
                    <span className="text-xs mt-2 font-medium text-white/80">Cellular</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDarkMode(!darkMode)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10",
                      "transition-colors duration-200",
                      darkMode && "bg-purple-500/20 border-purple-500/50"
                    )}
                  >
                    {darkMode ? (
                      <Moon className="w-6 h-6 text-purple-400" />
                    ) : (
                      <Sun className="w-6 h-6 text-yellow-400" />
                    )}
                    <span className="text-xs mt-2 font-medium text-white/80">
                      {darkMode ? 'Dark' : 'Light'}
                    </span>
                  </motion.button>
                </div>

                {/* Sliders */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-white/80">
                      <span>Volume</span>
                      <span>{volume}%</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <VolumeX className="w-5 h-5 text-white/60" />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(parseInt(e.target.value))}
                        className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                      />
                      <Volume2 className="w-5 h-5 text-white/60" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-white/80">
                      <span>Brightness</span>
                      <span>{brightness}%</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Sun className="w-5 h-5 text-white/60" />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={brightness}
                        onChange={(e) => setBrightness(parseInt(e.target.value))}
                        className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                      />
                      <Sun className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Handle */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full" />
              </animated.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
} 