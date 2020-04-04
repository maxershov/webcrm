import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="menu-container">
      <h1 className="askPhoneTurn font_white_shadow">Используйте альбомный режим<br />⤵</h1>
      <NavLink activeClassName="is-active" to="/main">Главная</NavLink>
      <NavLink activeClassName="is-active" to="/all/page/1">Все</NavLink>
      <NavLink activeClassName="is-active" to="/clients/page/1">Клиенты</NavLink>
      <NavLink activeClassName="is-active" to="/lead/page/1">Лид</NavLink>      
      <NavLink activeClassName="is-active" to="/lost/page/1">Бывшие</NavLink>
      <NavLink activeClassName="is-active" to="/employee/page/1">Сотрудники</NavLink>
    </nav>
  );
}


export default Header;