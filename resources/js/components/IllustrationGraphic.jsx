import React from 'react';

export const IllustrationGraphic = ({ type, className = 'w-16 h-16' }) => {
  switch (type) {
    case 'skull':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="50" cy="50" r="46" fill="#F8FAFC" stroke="#094067" strokeWidth="2" strokeDasharray="3 3" />
          {/* Anatomical Head / Skull Silhouette */}
          <path
            d="M50 20C35 20 28 32 28 46C28 56 33 63 36 67C37 72 38 78 43 80C47 81 53 81 57 80C62 78 63 72 64 67C67 63 72 56 72 46C72 32 65 20 50 20Z"
            fill="#FFFFFE"
            stroke="#094067"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Eye Orbit */}
          <ellipse cx="40" cy="46" rx="5" ry="6" stroke="#094067" strokeWidth="2" fill="#20A0D8" fillOpacity="0.2" />
          <ellipse cx="60" cy="46" rx="5" ry="6" stroke="#094067" strokeWidth="2" fill="#20A0D8" fillOpacity="0.2" />
          {/* Nasal Cavity */}
          <path d="M50 50L48 57H52L50 50Z" fill="#094067" />
          {/* Teeth / Maxilla lines */}
          <path d="M43 68H57" stroke="#094067" strokeWidth="2" strokeLinecap="round" />
          <path d="M46 66V70" stroke="#094067" strokeWidth="1.5" />
          <path d="M50 66V70" stroke="#094067" strokeWidth="1.5" />
          <path d="M54 66V70" stroke="#094067" strokeWidth="1.5" />
          {/* Orientation crosshairs */}
          <line x1="50" y1="8" x2="50" y2="16" stroke="#20A0D8" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="84" x2="50" y2="92" stroke="#20A0D8" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="50" x2="16" y2="50" stroke="#20A0D8" strokeWidth="2" strokeLinecap="round" />
          <line x1="84" y1="50" x2="92" y2="50" stroke="#20A0D8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'eye':
      return (
        <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="100" rx="12" fill="#F0F9FF" />
          {/* Anatomical Eye Cross-section / Globe */}
          <ellipse cx="60" cy="50" rx="38" ry="32" fill="#FFFFFE" stroke="#094067" strokeWidth="2.5" />
          {/* Sclera & Cornea contour */}
          <path d="M22 50C22 50 36 30 60 30C84 30 98 50 98 50C98 50 84 70 60 70C36 70 22 50 22 50Z" fill="#F8FAFC" stroke="#094067" strokeWidth="2" />
          {/* Iris */}
          <circle cx="60" cy="50" r="16" fill="#20A0D8" stroke="#0E4C67" strokeWidth="2" />
          {/* Pupil */}
          <circle cx="60" cy="50" r="8" fill="#094067" />
          <circle cx="57" cy="47" r="3" fill="#FFFFFE" />
          {/* Optic nerve outline */}
          <path d="M98 46C104 46 108 48 112 48" stroke="#094067" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M98 54C104 54 108 52 112 52" stroke="#094067" strokeWidth="2.5" strokeLinecap="round" />
          {/* Annotation label */}
          <text x="60" y="86" textAnchor="middle" fill="#0E4C67" fontSize="9" fontWeight="600" fontFamily="Karla">
            Gross Anatomy (Macroscopic)
          </text>
        </svg>
      );
    case 'microscope':
      return (
        <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="100" rx="12" fill="#F0F9FF" />
          {/* Eyepiece / Tube */}
          <rect x="42" y="16" width="10" height="14" rx="2" fill="#094067" />
          <path d="M47 30L55 48" stroke="#094067" strokeWidth="5" strokeLinecap="round" />
          {/* Objective lenses */}
          <circle cx="55" cy="48" r="7" fill="#20A0D8" stroke="#094067" strokeWidth="2" />
          <rect x="52" y="55" width="6" height="8" rx="1" fill="#0E4C67" />
          {/* Stage */}
          <rect x="36" y="63" width="38" height="4" rx="2" fill="#094067" />
          {/* Specimen slide */}
          <rect x="44" y="60" width="22" height="3" rx="1" fill="#00E593" />
          {/* Base & Arm */}
          <path d="M68 38C78 44 78 68 70 76" stroke="#094067" strokeWidth="4" strokeLinecap="round" />
          <rect x="30" y="78" width="54" height="6" rx="3" fill="#094067" />
          <text x="60" y="93" textAnchor="middle" fill="#0E4C67" fontSize="9" fontWeight="600" fontFamily="Karla">
            Microscopic (Cytology/Histology)
          </text>
        </svg>
      );
    case 'cells':
      return (
        <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="100" rx="12" fill="#F0FDF4" />
          {/* Cellular Matrix Pattern */}
          <path d="M40 32L54 24L68 32L68 48L54 56L40 48Z" fill="#FFFFFE" stroke="#00E593" strokeWidth="2" />
          <circle cx="54" cy="40" r="4" fill="#20A0D8" />

          <path d="M68 32L82 24L96 32L96 48L82 56L68 48Z" fill="#FFFFFE" stroke="#00E593" strokeWidth="2" />
          <circle cx="82" cy="40" r="4" fill="#20A0D8" />

          <path d="M54 56L68 48L82 56L82 72L68 80L54 72Z" fill="#FFFFFE" stroke="#00E593" strokeWidth="2" />
          <circle cx="68" cy="64" r="4" fill="#0E4C67" />

          <text x="60" y="92" textAnchor="middle" fill="#094067" fontSize="9" fontWeight="600" fontFamily="Karla">
            Tissue Architecture & Histology
          </text>
        </svg>
      );
    case 'skeleton':
      return (
        <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="100" rx="12" fill="#F8FAFC" />
          {/* Anatomical Vertebra / Spinal segment */}
          <circle cx="60" cy="24" r="8" fill="#FFFFFE" stroke="#094067" strokeWidth="2" />
          <path d="M60 32V68" stroke="#094067" strokeWidth="3" strokeLinecap="round" />
          {/* Ribs / Thoracic cage curves */}
          <path d="M42 40C48 38 56 40 60 40C64 40 72 38 78 40" stroke="#20A0D8" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M38 48C46 46 56 48 60 48C64 48 74 46 82 48" stroke="#20A0D8" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M40 56C48 54 56 56 60 56C64 56 72 54 80 56" stroke="#20A0D8" strokeWidth="2.5" strokeLinecap="round" />
          {/* Pelvis curve */}
          <path d="M46 68C52 64 68 64 74 68L68 76H52L46 68Z" fill="#FFFFFE" stroke="#094067" strokeWidth="2" />
          <text x="60" y="88" textAnchor="middle" fill="#094067" fontSize="9" fontWeight="600" fontFamily="Karla">
            Anatomical Landmark Axis
          </text>
        </svg>
      );
    default:
      return null;
  }
};
