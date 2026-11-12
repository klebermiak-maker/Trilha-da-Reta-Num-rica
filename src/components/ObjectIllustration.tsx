import React from 'react';
import { ObjectKind } from '../types/game';

interface ObjectIllustrationProps {
  kind: ObjectKind;
  className?: string;
}

export const OBJECT_META: Record<ObjectKind, { name: string; colorClass: string; bgClass: string }> = {
  apple: { name: 'Maçã', colorClass: 'text-rose-600', bgClass: 'bg-rose-50 border-rose-200' },
  frog: { name: 'Sapo', colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50 border-emerald-200' },
  turtle: { name: 'Tartaruga', colorClass: 'text-teal-700', bgClass: 'bg-teal-50 border-teal-200' },
  star: { name: 'Estrela', colorClass: 'text-amber-500', bgClass: 'bg-amber-50 border-amber-200' },
  rocket: { name: 'Foguete', colorClass: 'text-sky-600', bgClass: 'bg-sky-50 border-sky-200' },
  submarine: { name: 'Submarino', colorClass: 'text-amber-600', bgClass: 'bg-amber-50 border-amber-200' },
  gem: { name: 'Cristal', colorClass: 'text-cyan-600', bgClass: 'bg-cyan-50 border-cyan-200' },
  compass: { name: 'Bússola', colorClass: 'text-indigo-600', bgClass: 'bg-indigo-50 border-indigo-200' },
  telescope: { name: 'Luneta', colorClass: 'text-blue-700', bgClass: 'bg-blue-50 border-blue-200' },
  chest: { name: 'Baú', colorClass: 'text-orange-700', bgClass: 'bg-orange-50 border-orange-200' },
  planet: { name: 'Planeta', colorClass: 'text-violet-600', bgClass: 'bg-violet-50 border-violet-200' },
  owl: { name: 'Coruja', colorClass: 'text-amber-800', bgClass: 'bg-amber-50 border-amber-200' },
};

export const ObjectIllustration: React.FC<ObjectIllustrationProps> = ({ kind, className = 'w-6 h-6' }) => {
  switch (kind) {
    case 'apple':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <path d="M16 7C16 4.5 18 3 20.5 3C20.5 5.5 18.5 7 16 7Z" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
          <path d="M16 7C14.5 5 13.5 4 12.5 3.5" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M16 9C12 7 6 9.5 6 16.5C6 22.5 10.5 28 14 28C15.2 28 15.6 27.3 16 27.3C16.4 27.3 16.8 28 18 28C21.5 28 26 22.5 26 16.5C26 9.5 20 7 16 9Z"
            fill="#F43F5E"
            stroke="#BE123C"
            strokeWidth="1.8"
          />
          <path d="M10 14C9.5 16 10 18.5 11 20" stroke="#FDA4AF" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'frog':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <circle cx="10" cy="10" r="4" fill="#34D399" stroke="#047857" strokeWidth="1.8" />
          <circle cx="22" cy="10" r="4" fill="#34D399" stroke="#047857" strokeWidth="1.8" />
          <ellipse cx="16" cy="19" rx="11" ry="8" fill="#10B981" stroke="#047857" strokeWidth="1.8" />
          <circle cx="10" cy="10" r="1.6" fill="#0F172A" />
          <circle cx="22" cy="10" r="1.6" fill="#0F172A" />
          <path d="M10 20C12 22.5 20 22.5 22 20" stroke="#064E3B" strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx="16" cy="23" rx="6" ry="2.5" fill="#A7F3D0" />
        </svg>
      );
    case 'turtle':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <circle cx="27" cy="17" r="3.2" fill="#34D399" stroke="#065F46" strokeWidth="1.6" />
          <circle cx="28" cy="16.2" r="0.9" fill="#0F172A" />
          <path d="M8 22L6 26M21 22L23 26M11 22L10 26M18 22L19 26" stroke="#065F46" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M5 20C5 12.8 10 9 15.5 9C21 9 25 12.8 25 20H5Z" fill="#0D9488" stroke="#115E59" strokeWidth="1.8" />
          <path d="M15.5 9V20M10 11L13 20M21 11L18 20" stroke="#99F6E4" strokeWidth="1.4" />
        </svg>
      );
    case 'star':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <path
            d="M16 3.5L19.7 11L28 12.2L22 18L23.4 26.3L16 22.4L8.6 26.3L10 18L4 12.2L12.3 11L16 3.5Z"
            fill="#FBBF24"
            stroke="#B45309"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="13.5" cy="15" r="1.2" fill="#78350F" />
          <circle cx="18.5" cy="15" r="1.2" fill="#78350F" />
          <path d="M14 18C15 19 17 19 18 18" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'rocket':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <path d="M16 3C21 7.5 23 14 23 21H9C9 14 11 7.5 16 3Z" fill="#38BDF8" stroke="#0369A1" strokeWidth="1.8" />
          <path d="M9 17L5 22V24H9.5" fill="#F43F5E" stroke="#BE123C" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M23 17L27 22V24H22.5" fill="#F43F5E" stroke="#BE123C" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="16" cy="13" r="3" fill="#E0F2FE" stroke="#0369A1" strokeWidth="1.6" />
          <path d="M13 21L16 28L19 21H13Z" fill="#FB923C" stroke="#C2410C" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case 'submarine':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <path d="M14 11V7H18V11" fill="#FBBF24" stroke="#B45309" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M16 7V4H20" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="6" y="11" width="21" height="12" rx="6" fill="#F59E0B" stroke="#B45309" strokeWidth="1.8" />
          <path d="M3 14L6 17L3 20V14Z" fill="#D97706" stroke="#92400E" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="12" cy="17" r="2" fill="#E0F2FE" stroke="#92400E" strokeWidth="1.4" />
          <circle cx="17.5" cy="17" r="2" fill="#E0F2FE" stroke="#92400E" strokeWidth="1.4" />
          <circle cx="22.5" cy="17" r="1.5" fill="#E0F2FE" stroke="#92400E" strokeWidth="1.4" />
        </svg>
      );
    case 'gem':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <path d="M9 6H23L28 13L16 27L4 13L9 6Z" fill="#22D3EE" stroke="#0E7490" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M4 13H28M9 6L12.5 13L16 27M23 6L19.5 13L16 27" stroke="#0891B2" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      );
    case 'compass':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <circle cx="16" cy="16" r="12" fill="#EEF2FF" stroke="#4338CA" strokeWidth="1.8" />
          <polygon points="16,7 19,16 16,14 13,16" fill="#EF4444" />
          <polygon points="16,25 19,16 16,18 13,16" fill="#4338CA" />
          <circle cx="16" cy="16" r="2" fill="#1E1B4B" />
        </svg>
      );
    case 'telescope':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <path d="M6 19L24 9L27 14L8 23L6 19Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M16 18L11 28M16 18L21 28M16 18V27" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="25.5" cy="11.5" r="2.5" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="1.5" />
        </svg>
      );
    case 'chest':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <rect x="5" y="13" width="22" height="13" rx="2" fill="#D97706" stroke="#78350F" strokeWidth="1.8" />
          <path d="M5 13C5 9 8 7 16 7C24 7 27 9 27 13H5Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1.8" />
          <rect x="14" y="11" width="4" height="6" rx="1" fill="#FEF08A" stroke="#78350F" strokeWidth="1.5" />
        </svg>
      );
    case 'planet':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <circle cx="16" cy="16" r="8" fill="#8B5CF6" stroke="#5B21B6" strokeWidth="1.8" />
          <ellipse
            cx="16"
            cy="16"
            rx="14"
            ry="4"
            transform="rotate(-22 16 16)"
            stroke="#FBBF24"
            strokeWidth="2.2"
          />
        </svg>
      );
    case 'owl':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
          <path d="M9 10L7 6L12 8M23 10L25 6L20 8" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="8" y="8" width="16" height="19" rx="8" fill="#B45309" stroke="#78350F" strokeWidth="1.8" />
          <circle cx="13" cy="14" r="3" fill="#FEF3C7" stroke="#78350F" strokeWidth="1.4" />
          <circle cx="19" cy="14" r="3" fill="#FEF3C7" stroke="#78350F" strokeWidth="1.4" />
          <circle cx="13" cy="14" r="1.3" fill="#0F172A" />
          <circle cx="19" cy="14" r="1.3" fill="#0F172A" />
          <polygon points="16,16 14.5,19 17.5,19" fill="#F59E0B" />
        </svg>
      );
  }
};
