"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Plus } from "lucide-react"

interface InteractiveRowProps {
  children: React.ReactNode
  icon: "arrow" | "plus"
  label: string
  href?: string
  download?: string
  target?: string
  rel?: string
  className?: string
  title?: string
  ariaLabel?: string
  iconAlign?: "top" | "center"
}

export function InteractiveRow({
  children,
  icon,
  label,
  href,
  download,
  target,
  rel,
  className = "",
  title,
  ariaLabel,
  iconAlign = "center"
}: InteractiveRowProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const IconComponent = icon === "arrow" ? ArrowUpRight : Plus

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isApple = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent);
    
    if (href?.startsWith('https://maps.apple.com/') && isApple) {
      e.preventDefault();
      window.location.href = href.replace('https://maps.apple.com/', 'maps://');
    }
    
    if (href?.startsWith('data:text/calendar') && isApple) {
      e.preventDefault();
      // Create a blob URL to encourage Safari/macOS to open it directly in Calendar
      // rather than just saving a data URI to the Downloads folder.
      const icsData = href.substring(href.indexOf(',') + 1);
      const blob = new Blob([decodeURIComponent(icsData)], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      window.location.href = url;
      
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }

  return (
    <div 
      className={`group flex justify-between items-start active:opacity-50 transition-opacity cursor-pointer relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={title}
    >
      {href && (
        <a 
          href={href}
          download={download}
          target={target}
          rel={rel}
          className="absolute inset-0 z-30"
          aria-label={ariaLabel}
          onClick={handleLinkClick}
        />
      )}
      
      <div className="relative z-0 flex-1 min-w-0">
        {children}
      </div>

      {/* Mobile Icon */}
      <div className={`md:hidden w-12 h-12 rounded-full border border-transparent flex items-center justify-center shrink-0 ${iconAlign === "top" ? "mt-8" : "self-center"}`}>
        <IconComponent className="size-6 text-[var(--ink-muted)] group-hover:text-[var(--accent)] transition-colors" />
      </div>
      
      {/* Desktop Animated Icon */}
      <div className={`hidden md:block relative z-20 shrink-0 ${iconAlign === "top" ? "mt-10" : "self-center"}`}>
        <motion.div
          initial={{ width: 48, height: 48 }}
          animate={{ width: isHovered ? 180 : 48 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className={`flex items-center justify-center overflow-hidden relative border ${isHovered ? 'border-[var(--line-strong)] bg-[var(--surface)]' : 'border-transparent'}`}
          style={{ borderRadius: 24 }}
        >
          <motion.div
            className="absolute"
            animate={{ 
              opacity: isHovered ? 0 : 1,
              scale: isHovered ? 0.8 : 1
            }}
            transition={{ duration: 0.2 }}
          >
            <IconComponent className="size-6 text-[var(--ink-muted)] transition-colors" />
          </motion.div>

          <motion.div
            className="w-full flex justify-center items-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2, delay: isHovered ? 0.05 : 0 }}
          >
            <span className="text-[var(--accent)] text-sm font-medium whitespace-nowrap tracking-wide">
              {label}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
