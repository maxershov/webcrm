import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import burgerIcon from "../assets/burger.svg";


const Header = () => {
  const [openMenu, chgMenu] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);

  function handleClick(event) {
    // close burger menu after click on anchor
    if (event.target instanceof HTMLAnchorElement) {
      chgMenu(false);
    }
  }

  function chgTheme() {
    setDarkTheme(!darkTheme);
    darkTheme ? document.documentElement.setAttribute('data-theme', 'dark')
      : document.documentElement.setAttribute('data-theme', 'light');
  }

  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);


  return (
    <>
      <input id="burgerBtn" type="image" alt="burgerImg" onClick={() => chgMenu(!openMenu)} src={burgerIcon} />
      <nav className={openMenu ? "menu-container_open" : "menu-container"}>
        <NavLink activeClassName="menu-nav-active" to="/main">Главная
          <button className="darkThemeBtn" onClick={() => chgTheme(darkTheme)} type="button">
            {darkTheme ?
              <svg className="darkThemeIcon" xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M17.75 4.1l-2.53 1.94.9 3.06-2.63-1.8-2.63 1.8.9-3.06L9.25 4.1l3.2-.1 1.06-3 1.06 3 3.2.1m3.5 6.9l-1.64 1.25.6 1.98-1.7-1.17-1.7 1.17.6-1.98L15.75 11l2.06-.05.7-1.95.7 1.95 2.06.05m-2.28 4.95c.83-.08 1.72 1.1 1.2 1.85-.32.45-.66.87-1.08 1.27-3.9 3.93-10.24 3.93-14.14 0a9.99 9.99 0 0 1 0-14.14c.4-.4.82-.76 1.27-1.08.75-.53 1.93.36 1.85 1.2-.27 2.86.7 5.83 2.9 8.02a9.96 9.96 0 0 0 8.02 2.89m-1.64 2.02a12.08 12.08 0 0 1-7.8-3.47 12.07 12.07 0 0 1-3.49-7.82c-2.8 3.14-2.7 7.96.3 10.98 3.02 3 7.84 3.12 10.98.3z" /></svg>
              :
              <svg className="darkThemeIcon" xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm4 8a4 4 0 1 1-8 0a4 4 0 0 1 8 0zm-.464 4.95l.707.707a1 1 0 0 0 1.414-1.414l-.707-.707a1 1 0 0 0-1.414 1.414zm2.12-10.607a1 1 0 0 1 0 1.414l-.706.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0zM17 11a1 1 0 1 0 0-2h-1a1 1 0 1 0 0 2h1zm-7 4a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zM5.05 6.464A1 1 0 1 0 6.465 5.05l-.708-.707a1 1 0 0 0-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 1.414zM4 11a1 1 0 1 0 0-2H3a1 1 0 0 0 0 2h1z" /></svg>}
          </button>
        </NavLink>
        <NavLink activeClassName="menu-nav-active" to="/all/page/1">Все</NavLink>
        <NavLink activeClassName="menu-nav-active" to="/clients/page/1">Клиенты</NavLink>
        <NavLink activeClassName="menu-nav-active" to="/lead/page/1">Лид</NavLink>
        <NavLink activeClassName="menu-nav-active" to="/lost/page/1">Прошлые</NavLink>
        <NavLink activeClassName="menu-nav-active" to="/employee/page/1">Сотрудники</NavLink>
      </nav>
    </>
  );
}


export default Header;