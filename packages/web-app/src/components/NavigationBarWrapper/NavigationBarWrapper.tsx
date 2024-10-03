import './index.scss';

interface NavigationBarProps {
  children: React.ReactNode;
}
const NavigationBarWrapper = ({ children }: NavigationBarProps) => {
  return <nav className='navigation-wrapper'>{children}</nav>;
};

export default NavigationBarWrapper;
