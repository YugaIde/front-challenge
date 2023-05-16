import { useState, useEffect, useRef, Suspense, useDeferredValue } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Update import statement
import { db, storage } from "../../firebase";
import { useAuthContext } from '../../context/AuthContext';
import "./ProfileShow.css";

function ProfileShow() {
  const { user } = useAuthContext();

  const [avatarURL, setAvatarURL] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [editing, setEditing] = useState(false);
  const [editedAvatar, setEditedAvatar] = useState(null);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedGender, setEditedGender] = useState("");
  const [editedAge, setEditedAge] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileDoc = await getDoc(doc(db, "profiles", user.uid));

      if (profileDoc.exists()) {
        const data = profileDoc.data();
        setAvatarURL(data.avatarURL);
        setUsername(data.username);
        setGender(data.gender);
        setAge(data.age);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setEditedAvatar(file);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editedAvatar) {
        const storageRef = ref(storage, `avatars/${editedAvatar.name}`);
        const uploadTask = uploadBytesResumable(storageRef, editedAvatar); // Use uploadBytesResumable instead of uploadBytes
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Progress monitoring if needed
          },
          (error) => {
            console.error("Error uploading avatar:", error);
          },
          () => {
            // Upload completed successfully
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setAvatarURL(downloadURL);
              saveProfile();
            });
          }
        );
      } else {
        saveProfile();
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const saveProfile = async () => {
    try {
      await setDoc(doc(db, "profiles", user.uid), {
        avatarURL: avatarURL,
        username: editedUsername,
        gender: editedGender,
        age: editedAge,
      });

      setEditing(false);
      setEditedAvatar(null);
      setEditedUsername("");
      setEditedGender("");
      setEditedAge("");

      console.log("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div className="content">
      <Suspense fallback={<div>Loading Avatar...</div>}>
        <Avatar src={avatarURL} alt="Avatar" />
      </Suspense>
      <p>name: {username}</p>
      <p>Gender: {gender}</p>
      <p>Age: {age}</p>
      {!editing && (
        <button onClick={() => setEditing(true)}>
          Edit Profile
          </button>
      )}
      {editing && (
        <form onSubmit={handleProfileSubmit}>
          <input type="file" onChange={handleAvatarChange} />
          <label htmlFor="username">name</label>
          <input
            type="text"
            id="username"
            value={editedUsername}
            onChange={(e) => setEditedUsername(e.target.value)}
          />
          <label htmlFor="gender">gender</label>
          <select
            id="gender"
            value={editedGender}
            onChange={(e) => setEditedGender(e.target.value)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <label htmlFor="age">age</label>
          <input
            type="text"
            id="age"
            value={editedAge}
            onChange={(e) => setEditedAge(e.target.value)}
          />
          <button type="submit">Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </form>
      )}
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

  return (
    <img ref={imageRef} src={src} alt={alt} width="200" height="auto" />
  );
};

export default ProfileShow;
