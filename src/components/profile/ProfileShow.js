import { useState, useEffect, useRef, Suspense, useDeferredValue } from 'react';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';

function ProfileShow() {
    // プロフィール情報を管理するためのステート変数とセッター関数を定義
  const [username, setUsername] = useState(''); // ユーザー名の状態を管理
  const [avatarURL, setAvatarURL] = useState(''); // アバター画像のURLを管理
  const [editing, setEditing] = useState(false); // 編集モードの状態を管理
  const [editedUsername, setEditedUsername] = useState(''); // 編集されたユーザー名の状態を管理
  const [editedAvatar, setEditedAvatar] = useState(null); // 編集されたアバター画像の状態を管理

  useEffect(() => {
    loadProfile(); // プロフィール情報を読み込む
  }, []);

  const loadProfile = async () => {
    try {
      const profileDoc = await getDoc(doc(db, 'profiles', 'user1')); // 'profiles'コレクション内の'user1'ドキュメントを取得

      if (profileDoc.exists()) {
        const data = profileDoc.data(); // ドキュメントのデータを取得
        setUsername(data.username); // ユーザー名を設定
        setAvatarURL(data.avatarURL); // アバター画像のURLを設定
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setEditedAvatar(file); // 編集されたアバター画像を設定
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editedAvatar) {
        const storageRef = ref(storage, `avatars/${editedAvatar.name}`); // アバター画像を保存する参照を作成
        await uploadBytes(storageRef, editedAvatar); // アバター画像をストレージにアップロード
        const downloadURL = await getDownloadURL(storageRef); // アップロード後のダウンロードURLを取得
        setAvatarURL(downloadURL); // アバター画像のURLを設定
      }

      await setDoc(doc(db, 'profiles', 'user1'), {
        username: editedUsername, // 編集されたユーザー名を保存
        avatarURL: avatarURL // アバター画像のURLを保存
      });

      setEditing(false); // 編集モードを終了
      setEditedUsername(''); // 編集されたユーザー名を初期化
      setEditedAvatar(null); // 編集されたアバター画像を初期化

      console.log('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div>
      <h1>Profile</h1> {/* プロフィールの見出し */}
      <p>name: {username}</p> {/* ユーザー名の表示 */}
      <Suspense fallback={<div>Loading Avatar...</div>}> {/* Avatarコンポーネントの遅延読み込み */}
        <Avatar src={avatarURL} alt="Avatar" /> {/* Avatarコンポーネントの描画 */}
      </Suspense>
  
      {/* 編集モードじゃない場合は、プロフィール編集ボタンを表示 */}
      {!editing && (
        <button onClick={() => setEditing(true)}>Edit Profile</button> /* プロフィール編集ボタン */
      )}
  
      {/* 編集モードの場合はプロフィール編集フォームを表示 */}
      {editing && (
        <form onSubmit={handleProfileSubmit}>
          <input
            type="text"
            value={editedUsername}
            onChange={(e) => setEditedUsername(e.target.value)} // ユーザー名の入力フィールド
          />
          <input type="file" onChange={handleAvatarChange} /> {/* アバター画像の選択フィールド */}
          <button type="submit">Save</button> {/* 保存ボタン */}
          <button onClick={() => setEditing(false)}>Cancel</button> {/* キャンセルボタン */}
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
      if (imageRef.current ) { // 画像の参照が存在したら
        imageRef.current.src = deferredSrc; // 画像のsrc属性を設定
      }
    }, [deferredSrc, src]);
  
    return <img ref={imageRef} src={src} alt={alt} />; // 画像の表示
  };
  

export default ProfileShow;
