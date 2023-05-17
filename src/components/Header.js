import React, { useState } from "react";
import { auth } from '../firebase';
import { Link, useNavigate } from "react-router-dom";
import "./Header.css"; // スタイルを定義したCSSファイルのインポート
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function Header() {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleLogout = () => {
    auth.signOut();
    setOpenSnackbar(true);
    navigate('/glogin');
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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

      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          ログアウトしました
        </MuiAlert>
      </Snackbar>
    </nav>
  );
}

export default Header;
