"use client";

import React from "react";
import { PlatformType, PLATFORM_INFO } from "@/lib/platformDetect";
import { Instagram, Youtube, Facebook, Video, Link2 } from "lucide-react";

interface PlatformBadgeProps {
  platform: PlatformType;
  showLabel?: boolean;
  className?: string;
}

/**
 * Platform logosunu ve ismini gösteren rozet bileşeni
 */
export function PlatformBadge({ platform, showLabel = true, className = "" }: PlatformBadgeProps) {
  const info = PLATFORM_INFO[platform];

  const renderIcon = () => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case "tiktok":
        return <Video className="w-4 h-4 text-cyan-400" />;
      case "youtube":
        return <Youtube className="w-4 h-4 text-red-500" />;
      case "facebook":
        return <Facebook className="w-4 h-4 text-blue-500" />;
      default:
        return <Link2 className="w-4 h-4 text-gray-400" />;
    }
  };

  if (platform === "unknown") {
    return null;
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all duration-300 ${info.badgeBg} ${info.badgeText} ${className}`}
    >
      {renderIcon()}
      {showLabel && <span>{info.name}</span>}
    </div>
  );
}
