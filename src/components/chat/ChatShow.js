import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { useAuthContext } from '../../context/AuthContext';
import {db} from '../../firebase';

function ChatShow() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'messages'), orderBy('timestamp')), (snapshot) => {
      const messageData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messageData);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') {
      return;
    }

    try {
      await addDoc(collection(db, 'messages'), {
        message: newMessage,
        timestamp: new Date()
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const { user } = useAuthContext();
  if (!user) {
    return <Navigate to="/glogin" replace />;
  }

  return (
    <div>
      <h1>Chat Room</h1>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <p>{message.message}</p>
          </div>
        ))}
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

export default ChatShow;