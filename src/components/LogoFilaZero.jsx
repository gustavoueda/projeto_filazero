import logo from '../assets/logo.png';

export default function LogoFilaZero({ size = 120 }) {
  return (
    <img
      src={logo}
      alt="FilaZero"
      width={size}
      style={{ display: 'block' }}
    />
  );
}
