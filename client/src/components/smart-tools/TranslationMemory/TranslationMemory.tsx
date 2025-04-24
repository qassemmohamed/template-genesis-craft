import React, { useState } from "react";
import axios from "axios";

const TranslationMemory = () => {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState("");

  const handleTranslate = async () => {
    try {
      const response = await axios.post(
        "https://targum.io/api/translate",
        {
          text: inputText,
          source: "en",
          target: "es",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setResult(response.data.translation);
    } catch (error) {
      console.error(
        "Translation error:",
        error.response?.data || error.message,
      );
      setResult("Translation failed. Check console for details.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Translation</h2>
      <textarea
        rows={4}
        cols={50}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text..."
        style={{ marginBottom: 10 }}
      />
      <br />
      <button onClick={handleTranslate}>Submit</button>
      <p>{result}</p>
    </div>
  );
};

export default TranslationMemory;
