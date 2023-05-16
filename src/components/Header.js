// Header.js

import React from "react";
import { auth } from '../firebase';
import { Link, useNavigate } from "react-router-dom";
import "./Header.css"; // 追加: スタイルを定義したCSSファイルのインポート

function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut();
        navigate('/glogin');
      };

  return (
    <nav className="header">
      <ul className="nav-menu">
        <li className="left">
          <Link to="/">front chat app</Link>
        </li>
        <div className="right">
          <li>
            <Link to="/chat/chat_show">chat</Link>
          </li>
          <li>
            <Link to="/profile/profile_show">profile</Link>
          </li>
          <li>
            <Link to="/contact/contact_show">contact</Link>
          </li>
          <li>
          <button onClick={handleLogout}>ログアウト</button>
          </li>
        </div>
      </ul>
    </nav>
  );
}

export default Header;
