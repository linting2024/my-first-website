"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { faImage } from "@fortawesome/free-solid-svg-icons"
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import GeneratorButton from "@/components/GenerateButton";
import ImageGenCard from "@/components/ImageGenCard";
import ImageGenPlaceholder from "@/components/ImageGenPlaceholder";

export default function ImgGen() {
    const [userInput, setUserInput] = useState("");
    const [cardList, setCardList] = useState([]);
    // 是否在等待回應
    const [isWaiting, setIsWaiting] = useState(false);

    useEffect(() => {
        axios
            .get("/api/image-ai")
            .then(res => {
                const newCardList = res.data;
                console.log("newCardList:", newCardList)
                setCardList(newCardList);
            })
            .catch(err => {
                console.log("err:",err);
            })
    }, []);

    function submitHandler(e) {
        e.preventDefault();
        console.log("User Input: ", userInput);
        const body = { userInput };
        console.log("body:", body);
        setUserInput("");
        setIsWaiting(true);
        // TODO: 將body POST到 /api/image-ai { userInput: "" }
        axios
            .post("/api/image-ai", body)
            .then(res => {
                setIsWaiting(false);
                const card = res.data;
                console.log("後端傳給前端的資料", card);
                setCardList([card, ...cardList]);
            })
            .catch(err => {
                setIsWaiting(false);
                console.log("err", err);
                alert("發生錯誤，請稍後再試");
            });


    }

    return (
        <>
            <CurrentFileIndicator filePath="/app/image-generator/page.js" />
            <PageHeader title="AI Image Generator" icon={faImage} />
            <section>
                <div className="container mx-auto">
                    <form onSubmit={submitHandler}>
                        <div className="flex">
                            <div className="w-4/5 px-2">
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
                                <GeneratorButton />
                            </div>
                        </div>
                    </form>
                </div>
            </section>
            <section>
                <div className="container mx-auto">
                    {/* 顯示AI輸出結果 */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
                        {isWaiting ? <ImageGenPlaceholder/> : null}
                        {cardList.map(card => {
                            const{ imageURL, prompt, createdAt} = card;
                            return <ImageGenCard
                                imageURL={imageURL}
                                prompt={prompt}
                                key={createdAt}
                            />
                        })}
                        
                    </div>

                </div>
            </section>
        </>
    )
}