import { navbarData } from '../utils/utils';

const NavbarItem = ({ title, url, badge, active }) => (
  <li className='nav__item'>
    <a className={`nav__link${active ? ' nav__link--active' : ''}`} href={url}>
      <span className='nav__link__element'>{title}</span>
      {badge && (
        <span className='nav__link__element'>
          <span className='badge'>{badge}</span>
        </span>
      )}
    </a>
  </li>
);

const Navbar = () => {
  return (
    <header className='app-header'>
      {/* Logo-like Title */}
      <div className='app-header__anchor'>
        <span className='app-header__anchor__text'>Codex - Your Coding AI</span>
      </div>
      {/* Navbar */}
      <nav>
        <ul className='nav'>
          {navbarData.map((nav) => <NavbarItem key={nav.title} {...nav} />)}
        </ul>
      </nav>
      {/* Need it as space on the right */}
      <div></div>
    </header>
  );
};

export default Navbar;
