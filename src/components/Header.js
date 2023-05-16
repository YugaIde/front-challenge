// Header.js

import React from "react";
import { auth } from '../firebase';
import { Link, useNavigate } from "react-router-dom";
import "./Header.css"; // 追加: スタイルを定義したCSSファイルのインポート

function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut();
        navigate('/login');
      };

  return (
    <nav className="header">
      <ul className="nav-menu">
        <li class="left">
          <Link to="/">front chat app</Link>
        </li>
        <div class="right">
          <li>
            <Link to="/chat/chat_room">chat</Link>
          </li>
          <li>
            <Link to="/profile/profile_show">profile</Link>
          </li>
          <li>
            <Link to="/contact">contact</Link>
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
