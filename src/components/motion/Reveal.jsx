import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

// Petit wrapper réutilisé dans toutes les sections pour une apparition au
// scroll cohérente (Framer Motion), plutôt que de refaire des variants
// à la main dans chaque composant.
export default function Reveal({ as: Tag = 'div', delay = 0, className, children, ...rest }) {
  const MotionTag = motion[Tag] || motion.div;
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: Math.min(delay, 0.1), ease: 'easeOut' }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
