import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import burgerIcon from "../assets/burger.svg";


const Header = () => {
  const [openMenu, chgMenu] = useState(false);

  function handleClick(event){
    // close burger menu after click on anchor
    if (event.target instanceof HTMLAnchorElement) {
      chgMenu(false);
    }
  }


  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      <input id="burgerBtn" type="image" alt="burgerImg" onClick={() => chgMenu(!openMenu)} src={burgerIcon} />
      <nav className={openMenu ? "menu-container_open" : "menu-container"}>
        <NavLink activeClassName="menu-nav-active" to="/main">Главная</NavLink>
        <NavLink activeClassName="menu-nav-active" to="/all/page/1">Все</NavLink>
        <NavLink activeClassName="menu-nav-active" to="/clients/page/1">Клиенты</NavLink>
        <NavLink activeClassName="menu-nav-active" to="/lead/page/1">Лид</NavLink>
        <NavLink activeClassName="menu-nav-active" to="/lost/page/1">Бывшие</NavLink>
        <NavLink activeClassName="menu-nav-active" to="/employee/page/1">Сотрудники</NavLink>
      </nav>
    </>
  );
}


export default Header;