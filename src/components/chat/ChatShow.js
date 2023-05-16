import { useState, useEffect, useRef, useDeferredValue, Suspense } from "react";
import { Navigate } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import { useAuthContext } from "../../context/AuthContext";
import { db } from "../../firebase";
import "./ChatShow.css";

function ChatShow() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userProfiles, setUserProfiles] = useState({});
  const { user } = useAuthContext();

  useEffect(() => {
    loadProfiles(); // プロフィール情報をロードするために非同期関数を呼び出す

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
    }
  };

  if (!user) {
    return <Navigate to="/glogin" replace />;
  }

  return (
    <div>
      <h1>Chat Room</h1>
      <div class="container">
        {messages.map((message) => {
          const userProfile = userProfiles[message.uid];
          const messageClassName =
            user.uid === message.uid ? "sent" : "received";
          console.log(messageClassName);
          return (
            <div key={message.id} className={messageClassName}>
              {userProfile ? (
                <>
                  <div>
                    <Suspense fallback={<div>Loading Avatar...</div>}>
                      <Avatar src={userProfile.avatarURL} alt="Avatar" />
                    </Suspense>
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
    </div>
  );
}

const Avatar = ({ src, alt }) => {
  const imageRef = useRef(null);
  const deferredSrc = useDeferredValue(src, { timeoutMs: 2000 });

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.src = deferredSrc;
    }
  }, [deferredSrc]);

  return <img ref={imageRef} src={src} alt={alt} width="200" height="auto" />;
};

export default ChatShow;
