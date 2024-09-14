"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import GeneratorButton from "@/components/GenerateButton";
import VocabGenResultCard from "@/components/VocabGenResultCard";
import VocabGenResultPlaceholder from "@/components/VocabGenResultPlaceholder";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [language, setLanguage] = useState("English");
  // 所有的單字生成結果清單
  const [vocabList, setVocabList] = useState([]);
  // 是否在等待回應
  const [isWaiting, setIsWaiting] = useState(false);
  // useEffect(資料若變動時要執行的函式, [要綁定的資料])
  useEffect(() => {
    // 綁定的資料若為空，此處的流程只會在第一次渲染時執行
    console.log("副作用被觸發")
    axios
      .get("/api/vocab-ai")
      .then(res => {
        console.log("後端回應的資料",res.data);
        setVocabList(res.data);
      })
      .catch(err => {
        console.log("err:",err);
        alert("發生錯誤，請稍後再試");
      });
  }, [])

  function submitHandler(e) {
    e.preventDefault();
    // console.log("User Input: ", userInput);
    // console.log("Language: ", language);
    const body = { userInput, language };
    // console.log("body:", body);
    setIsWaiting(true);
    setUserInput("");
    // 將body POST到 /api/vocab-ai { userInput: "", language: "" }
    axios
      .post("/api/vocab-ai", body)
      .then(res => {
        console.log("後端回應的資料:", res.data);
        // 將最新的生成結果擺在清單最前面並保留過去的生成結果
        setVocabList([res.data, ...vocabList]);
        setIsWaiting(false);
      })
      .catch(err => {
        console.log("錯誤", err)
        setIsWaiting(false);
        alert("發生錯誤，請稍後再試");
      })
  }

  return (
    <>
      <CurrentFileIndicator filePath="/app/page.js" />
      <PageHeader title="AI Vocabulary Generator" icon={faEarthAmericas} />
      <section>
        <div className="container mx-auto">
          <form onSubmit={submitHandler}>
            <div className="flex">
              <div className="w-3/5 px-2">
                <input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  type="text"
                  className="border-2 focus:border-pink-500 w-full block p-3 rounded-lg"
                  placeholder="Enter a word or phrase"
                  required
                />
              </div>
              <div className="w-1/5 px-2">
                <select
                  className="border-2 w-full block p-3 rounded-lg"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                >
                  <option value="English">English</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Korean">Korean</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Italian">Italian</option>
                </select>
              </div>
              <div className="w-1/5 px-2">
                <GeneratorButton />
              </div>
            </div>
          </form>
        </div>
      </section>
      <section>
        <div className="container mx-auto">
          {/* 等待後端回應時要顯示的載入畫面 */}
          {isWaiting ? <VocabGenResultPlaceholder /> : null}
          {/* TODO: 顯示AI輸出結果 */}
          {vocabList.map(result => <VocabGenResultCard result={result} key={result.createdAt}/>)}
        </div>
      </section>
    </>
  );
}
