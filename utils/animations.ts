import { Variants } from 'framer-motion';

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const glitchVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const eliminateVariants: Variants = {
  initial: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  eliminated: {
    opacity: 0,
    scale: 0.5,
    y: 40,
    rotateZ: 360,
    transition: {
      duration: 0.8,
      ease: 'easeIn',
    },
  },
};

export const glitchTextVariants: Variants = {
  initial: {
    opacity: 1,
    x: 0,
  },
  glitch: {
    x: [-2, 2, -2, 2, 0],
    transition: {
      duration: 0.2,
      repeat: 2,
    },
  },
};

export const countdownVariants: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const stormVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      type: 'spring',
      stiffness: 100,
    },
  },
  strike: {
    boxShadow: [
      '0 0 0px rgba(255, 0, 110, 0)',
      '0 0 30px rgba(255, 0, 110, 0.8)',
      '0 0 60px rgba(255, 0, 110, 0.4)',
      '0 0 0px rgba(255, 0, 110, 0)',
    ],
    transition: {
      duration: 0.6,
    },
  },
};

export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
  exit: { opacity: 0, y: -40, transition: { duration: 0.4 } },
};

export const floatingVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const slideInFromLeftVariants: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

export const slideInFromRightVariants: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

export const rotateInVariants: Variants = {
  hidden: { opacity: 0, rotate: -180 },
  visible: {
    opacity: 1,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};
