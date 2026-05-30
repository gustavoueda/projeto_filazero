import { useEffect, useState } from 'react';
import LogoFilaZero from './LogoFilaZero';

export default function Splash({ onEnd }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 1600);
    const t2 = setTimeout(onEnd, 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onEnd]);

  return (
    <div style={{ ...styles.container, opacity: fadeOut ? 0 : 1, transition: 'opacity 0.5s ease' }}>
      <div style={styles.logoWrap}>
        <LogoFilaZero size={220} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: 480,
    minHeight: '100dvh',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    margin: '0 auto',
  },
  logoWrap: {
    filter: 'drop-shadow(0 8px 32px rgba(249,115,22,0.25))',
  },
};
