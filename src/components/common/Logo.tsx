import Image from 'next/image';

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center">
        <div className="relative h-8 w-8">
          <Image
            src="/images/logo.png"
            alt="GrayBay Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="ml-3">
          <p className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
            GrayBay
          </p>
          <p className="text-xs font-medium text-gray-500 -mt-1">
            IT Control Panel
          </p>
        </div>
      </div>
    </div>
  );
} 