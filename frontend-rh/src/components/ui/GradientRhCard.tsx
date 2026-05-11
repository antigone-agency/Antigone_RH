'use client';
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

type CardVariant = 'default' | 'ferie' | 'document';

const THEME: Record<CardVariant, {
  badgeBg: string; badgeText: string; badgeBorder: string;
  hoverGradient: string; hoverShadow: string;
}> = {
  default: {
    badgeBg:      'rgba(104,59,119,0.09)',
    badgeText:    '#683b77',
    badgeBorder:  'rgba(104,59,119,0.25)',
    hoverGradient:'linear-gradient(135deg, #683b77 0%, #9b5db0 60%, #ab78c3 100%)',
    hoverShadow:  '0 20px 60px rgba(104,59,119,0.35), 0 4px 16px rgba(104,59,119,0.2)',
  },
  ferie: {
    badgeBg:      'rgba(245,158,11,0.1)',
    badgeText:    '#92400e',
    badgeBorder:  'rgba(245,158,11,0.35)',
    hoverGradient:'linear-gradient(135deg, #683b77 0%, #9b5db0 60%, #ab78c3 100%)',
    hoverShadow:  '0 20px 60px rgba(104,59,119,0.35), 0 4px 16px rgba(104,59,119,0.2)',
  },
  document: {
    badgeBg:      'rgba(56,130,220,0.09)',
    badgeText:    '#1d6fa4',
    badgeBorder:  'rgba(56,130,220,0.25)',
    hoverGradient:'linear-gradient(135deg, #683b77 0%, #9b5db0 60%, #ab78c3 100%)',
    hoverShadow:  '0 20px 60px rgba(104,59,119,0.35), 0 4px 16px rgba(104,59,119,0.2)',
  },
};

interface GradientRhCardProps {
  title: string;
  status: string;
  meta: string;
  badges: string[];
  onClick: () => void;
  variant?: CardVariant;
}

export const GradientRhCard: React.FC<GradientRhCardProps> = ({
  title,
  status,
  meta,
  badges,
  onClick,
  variant = 'default',
}) => {
  const t = THEME[variant];
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setRotation({
        x: -(y / rect.height) * 5,
        y: (x / rect.width) * 5,
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      role="button"
      tabIndex={0}
      className="relative rounded-2xl overflow-hidden cursor-pointer"
      style={{ transformStyle: 'preserve-3d', minHeight: '200px' }}
      animate={{
        y: isHovered ? -6 : 0,
        rotateX: rotation.x,
        rotateY: rotation.y,
        boxShadow: isHovered
          ? t.hoverShadow
          : '0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.07)',
      }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Fond blanc */}
      <div className="absolute inset-0" style={{ background: '#ffffff', zIndex: 0 }} />

      {/* Overlay coloré qui apparaît au hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1, background: t.hoverGradient }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      />

      {/* Reflet brillant en haut-gauche */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%)',
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />

      {/* Bordure fine — visible au repos, invisible au hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ zIndex: 3, border: '1px solid rgba(0,0,0,0.08)' }}
        animate={{ opacity: isHovered ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />

      {/* Contenu */}
      <div className="relative flex flex-col h-full p-6" style={{ zIndex: 10, minHeight: '200px' }}>

        {/* Badge statut */}
        <div className="mb-4">
          <motion.span
            className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{ border: '1px solid', display: 'inline-block' }}
            animate={isHovered
              ? { backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.38)' }
              : { backgroundColor: t.badgeBg, color: t.badgeText, borderColor: t.badgeBorder }
            }
            transition={{ duration: 0.3 }}
          >
            {status}
          </motion.span>
        </div>

        {/* Titre */}
        <motion.h3
          className="font-bold flex-1"
          style={{ fontSize: '16px', letterSpacing: '-0.01em', lineHeight: 1.35 }}
          animate={{ color: isHovered ? '#ffffff' : '#1a1814' }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>

        {/* Meta */}
        <motion.p
          className="text-xs mt-2 mb-5"
          style={{ lineHeight: 1.5 }}
          animate={{ color: isHovered ? 'rgba(255,255,255,0.72)' : '#9ca3af' }}
          transition={{ duration: 0.3 }}
        >
          {meta}
        </motion.p>

        {/* Footer */}
        <motion.div
          className="flex items-center justify-between pt-4"
          animate={{ borderTopColor: isHovered ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.06)' }}
          style={{ borderTopWidth: 1, borderTopStyle: 'solid' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex gap-2 flex-wrap">
            {badges.slice(0, 2).map((badge, i) => (
              <motion.span
                key={i}
                className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                animate={isHovered
                  ? { backgroundColor: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.88)' }
                  : { backgroundColor: 'rgba(0,0,0,0.05)', color: '#6b7280' }
                }
                transition={{ duration: 0.3 }}
              >
                {badge}
              </motion.span>
            ))}
          </div>

          {/* Ouvrir → */}
          <motion.span
            className="text-xs font-bold flex items-center gap-1"
            style={{ color: '#ffffff', whiteSpace: 'nowrap' }}
            animate={{
              x:       isHovered ? 0   : 10,
              opacity: isHovered ? 1   : 0,
              scale:   isHovered ? 1   : 0.85,
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            Ouvrir
            <motion.span
              animate={{ x: isHovered ? 3 : 0 }}
              transition={{ duration: 0.25, ease: 'easeOut', delay: 0.06 }}
            >
              →
            </motion.span>
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
};
