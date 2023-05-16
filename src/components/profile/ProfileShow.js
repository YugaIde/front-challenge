import { useState, useEffect, useRef, Suspense, useDeferredValue } from "react";
import { Navigate } from "react-router-dom";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import { useAuthContext } from "../../context/AuthContext";
import "./ProfileShow.css";

function ProfileShow() {
  // プロフィール情報を管理するためのステート変数とセッター関数を定義
  const [avatarURL, setAvatarURL] = useState(""); // アバター画像のURLを管理
  const [username, setUsername] = useState(""); // ユーザー名の状態を管理
  const [gender, setGender] = useState(""); // 性別の状態を管理
  const [age, setAge] = useState(""); // 年齢の状態を管理
  const [editing, setEditing] = useState(false); // 編集モードの状態を管理
  const [editedAvatar, setEditedAvatar] = useState(null); // 編集されたアバター画像の状態を管理
  const [editedUsername, setEditedUsername] = useState(""); // 編集されたユーザー名の状態を管理
  const [editedGender, setEditedGender] = useState(""); // 編集されたユーザー名の状態を管理
  const [editedAge, setEditedAge] = useState(""); // 編集されたユーザー名の状態を管理

  useEffect(() => {
    loadProfile(); // プロフィール情報を読み込む
  }, []);

  const loadProfile = async () => {
    try {
      const profileDoc = await getDoc(doc(db, "profiles", "user1")); // 'profiles'コレクション内の'user1'ドキュメントを取得

      if (profileDoc.exists()) {
        const data = profileDoc.data(); // ドキュメントのデータを取得
        setAvatarURL(data.avatarURL); // アバター画像のURLを設定
        setUsername(data.username); // ユーザー名を設定
        setGender(data.gender); // 追加: 性別を設定
        setAge(data.age); // 追加: 年齢を設定
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setEditedAvatar(file); // 編集されたアバター画像を設定
  };

  // プロフィール情報を保存する関数。保存ボタンをクリックした時に実行される
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editedAvatar) {
        const storageRef = ref(storage, `avatars/${editedAvatar.name}`); // アバター画像を保存する参照を作成
        await uploadBytes(storageRef, editedAvatar); // アバター画像をストレージにアップロード
        const downloadURL = await getDownloadURL(storageRef); // アップロード後のダウンロードURLを取得
        setAvatarURL(downloadURL); // アバター画像のURLを設定
      }

      await setDoc(doc(db, "profiles", "user1"), {
        avatarURL: avatarURL, // アバター画像のURLを保存
        username: editedUsername, // 編集されたユーザー名を保存
        gender: editedGender, // 編集された性別を保存
        age: editedAge, // 編集された年齢を保存
      });

      setEditing(false); // 編集モードを終了
      setEditedAvatar(null); // 編集されたアバター画像を初期化
      setEditedUsername(""); // 編集されたユーザー名を初期化
      setEditedGender(""); // 編集された性別を初期化
      setEditedAge(""); // 編集された年齢を初期化

      console.log("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const { user } = useAuthContext();
  if (!user) {
    return <Navigate to="/glogin" replace />;
  }

  return (
    <div class="content">
      <Suspense fallback={<div>Loading Avatar...</div>}>
        {" "}
        {/* Avatarコンポーネントの遅延読み込み */}
        <Avatar src={avatarURL} alt="Avatar" />{" "}
        {/* Avatarコンポーネントの描画 */}
      </Suspense>
      <p>name: {username}</p> {/* ユーザー名の表示 */}
      <p>Gender: {gender}</p> {/* 追加: 性別を表示 */}
      <p>Age: {age}</p> {/* 追加: 年齢を表示 */}
      {/* 編集モードじゃない場合は、プロフィール編集ボタンを表示 */}
      {!editing && (
        <button onClick={() => setEditing(true)}>
          Edit Profile
        </button> /* プロフィール編集ボタン */
      )}
      {/* 編集モードの場合はプロフィール編集フォームを表示 */}
      {editing && (
        <form onSubmit={handleProfileSubmit}>
          {/*  アバター画像の選択フィールド */}
          <input type="file" onChange={handleAvatarChange} />{" "}
          {/* 名前の入力フィールド */}
          <label for="username">name</label>
          <input
            type="text"
            id="username"
            value={editedUsername}
            onChange={(e) => setEditedUsername(e.target.value)} // ユーザー名の入力フィールド
          />
          {/* 性別の入力フィールド */}
          <label for="gender">gender</label>
          <select
            id="gender"
            value={editedGender} // 現在の性別を表示
            onChange={(e) => setEditedGender(e.target.value)} // 性別の選択が変更された時の処理
          >
            <option value="male">Male</option> {/* 男性 */}
            <option value="female">Female</option> {/* 女性 */}
            <option value="other">Other</option> {/* その他 */}
          </select>
          {/* 年齢の入力フィールド  */}
          <label for="age">age</label>
          <input
            type="text"
            id="age"
            value={editedAge} // 追加: 現在の年齢を表示
            onChange={(e) => setEditedAge(e.target.value)} // 追加: 年齢の入力フィールド
          />
          <button type="submit">Save</button> {/* 保存ボタン */}
          <button onClick={() => setEditing(false)}>Cancel</button>{" "}
          {/* キャンセルボタン */}
        </form>
      )}
    </div>
  );
}

// Avatarコンポーネントの定義
const Avatar = ({ src, alt }) => {
  const imageRef = useRef(null); // 画像の参照を作成
  const deferredSrc = useDeferredValue(src, { timeoutMs: 2000 }); // srcの値を遅延させる

  useEffect(() => {
    console.log(imageRef.current);
    if (imageRef.current) {
      // 画像の参照が存在したら
      imageRef.current.src = deferredSrc; // 画像のsrc属性を設定
    }
  }, [deferredSrc, src]);

  return (
    <img ref={imageRef} src={src} alt={alt} width={"200"} height={"auto"} />
  ); // 画像の表示
};

export default ProfileShow;
