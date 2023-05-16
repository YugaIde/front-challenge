import Header from "./components/Header";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import GoogleLogin from "./components/GoogleLogin";
import ChatRoom from "./components/chat/ChatRoom";
import ProfileShow from "./components/profile/ProfileShow";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
            <Route path="/chat/chat_room" element={<ChatRoom />} />
            <Route path="/profile/profile_show" element={<ProfileShow />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
