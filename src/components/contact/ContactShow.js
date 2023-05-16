import { useState } from "react";

const Form = () => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.length > 10) {
      setError("名前は10文字以内で入力してください");
      return;
    }

    if (content.length > 100) {
      setError("コンテンツは100文字以内で入力してください");
      return;
    }

    try {
      const payload = {
        name: name, // 名前を追加
        content: content, // コンテンツを追加
      };

      // サーバーサイドのエンドポイントにリクエストを送信
      await fetch("http://localhost:5001/api/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // 送信後の処理
      alert("送信が完了しました");
      setName("");
      setContent("");
      setError("");
    } catch (error) {
      console.log(error);
      setError("送信に失敗しました");
    }
  };

  // ボタンのdisabledを制御する
  const isButtonDisabled = name.length > 10 || content.length > 100 || name === "" || content === "";

  return (
    <div>
      <h2>フォーム</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">名前:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="content">コンテンツ:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={isButtonDisabled}>送信</button>
      </form>
    </div>
  );
};

export default Form;
