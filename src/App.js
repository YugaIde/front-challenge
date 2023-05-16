import Header from "./components/Header";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import GoogleLogin from "./components/GoogleLogin";
import ChatShow from "./components/chat/ChatShow";
import ProfileShow from "./components/profile/ProfileShow";
import ContactShow from "./components/contact/ContactShow";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
// import PrivateRoute from "./components/PrivateRoute";
// import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <AuthProvider>
      <div style={{ margin: "2em" }}>
        <BrowserRouter>
        <Header/>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/glogin" element={<GoogleLogin />} />
            <Route path="/chat/chat_show" element={<ChatShow />} />
            <Route path="/profile/profile_show" element={<ProfileShow />} />
            <Route path="/contact/contact_show" element={<ContactShow />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

// 404ページ
function Error404() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>404</h2>
      <p>ページが見つかりません。</p>
      <button onClick={() => navigate('/')}>Top</button>
    </div>
  );
}


export default App;
