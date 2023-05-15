import { createContext, useState, useContext,useEffect } from 'react';
import { auth } from '../firebase';

// 認証情報のコンテキストを作成
const AuthContext = createContext();

// 認証情報のコンテキストを使用するためのカスタムフック
export function useAuthContext() {
  return useContext(AuthContext);
}

// 認証情報のコンテキストプロバイダーコンポーネント
export function AuthProvider({ children }) {
  // ユーザーの認証情報を管理するためのステート変数とセッター関数を定義
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // コンテキストに提供する値を定義
  const value = {
    user, // ユーザーの認証情報を値として設定
    loading, // ログイン状態の確認が完了したかどうかを値として設定
  };

  useEffect(() => {
    const unsubscribed = auth.onAuthStateChanged((user) => {
      console.log(user);
      setUser(user);
      setLoading(false);
    });
    return () => {
      unsubscribed();
    };
  }, []);

  if(loading){
    return <p>loading...</p>
  }
  // コンテキストプロバイダーコンポーネントをレンダリング
  return <AuthContext.Provider value={value}>
    {!loading && children}
    </AuthContext.Provider>;
}

export default AuthContext;