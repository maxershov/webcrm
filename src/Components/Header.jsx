import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="menu-container">
      <NavLink activeClassName="menu-nav-active" to="/main">Главная</NavLink>
      <NavLink activeClassName="menu-nav-active" to="/all/page/1">Все</NavLink>
      <NavLink activeClassName="menu-nav-active" to="/clients/page/1">Клиенты</NavLink>
      <NavLink activeClassName="menu-nav-active" to="/lead/page/1">Лид</NavLink>      
      <NavLink activeClassName="menu-nav-active" to="/lost/page/1">Бывшие</NavLink>
      <NavLink activeClassName="menu-nav-active" to="/employee/page/1">Сотрудники</NavLink>
    </nav>
  );
}


export default Header;