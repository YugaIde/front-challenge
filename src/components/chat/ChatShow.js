import { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { useAuthContext } from "../../context/AuthContext";
import { db } from "../../firebase";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./ChatShow.css";

function ChatShow() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userProfiles, setUserProfiles] = useState({});
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    loadProfiles();

    const unsubscribe = onSnapshot(
      query(collection(db, "messages"), orderBy("timestamp")),
      (snapshot) => {
        const messageData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messageData);
      }
    );

    return () => unsubscribe();
  }, []);

  const loadProfiles = async () => {
    try {
      const profilesQuerySnapshot = await getDocs(collection(db, "profiles"));
      const profilesData = {};
      profilesQuerySnapshot.forEach((doc) => {
        profilesData[doc.id] = doc.data();
      });
      setUserProfiles(profilesData);
    } catch (error) {
      console.error("Error loading profiles:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") {
      return;
    }

    try {
      await addDoc(collection(db, "messages"), {
        uid: user.uid,
        message: newMessage,
        timestamp: new Date(),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setOpenSnackbar(true);
    }
  };

  const closeSnackbar = () => {
    setOpenSnackbar(false);
  };

  const openUserProfileModal = (uid) => {
    const userProfile = userProfiles[uid];
    setSelectedUserProfile(userProfile);
  };

  const closeUserProfileModal = () => {
    setSelectedUserProfile(null);
  };

  if (!user) {
    return <Navigate to="/glogin" replace />;
  }

  return (
    <div>
      <h1>Chat Room</h1>
      <div className="container">
        {messages.map((message) => {
          const userProfile = userProfiles[message.uid];
          const messageClassName =
            user.uid === message.uid ? "sent" : "received";

          return (
            <div key={message.id} className={messageClassName}>
              {userProfile ? (
                <>
                  <div onClick={() => openUserProfileModal(message.uid)}>
                    <Avatar src={userProfile.avatarURL} alt="Avatar" />
                    <p className="username">{userProfile.username}</p>
                  </div>
                  <p className="message">{message.message}</p>
                </>
              ) : (
                <div>Loading profile...</div>
              )}
            </div>
          );
        })}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={closeSnackbar}
      >
        <MuiAlert onClose={closeSnackbar} severity="error">
          メッセージの送信に失敗しました
        </MuiAlert>
      </Snackbar>

      {selectedUserProfile && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedUserProfile.username}'s Profile</h2>
            <p>Email: {selectedUserProfile.email}</p>
            <p>Age: {selectedUserProfile.age}</p>
            <p>Location: {selectedUserProfile.location}</p>
            <button onClick={closeUserProfileModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const Avatar = ({ src, alt }) => {
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.src = src;
    }
  }, [src]);

  return <img ref={imageRef} src={src} alt={alt} width="200" height="auto" />;
};

export default ChatShow;
