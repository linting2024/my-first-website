import openai from "@/services/openai";
import db from "@/services/db"

const collectionName = "image-ai";

export async function GET() {
    const docList = await db.collection(collectionName).orderBy("createdAt","desc").get();
    const cardList = [];
    docList.forEach(doc => {
        const card = doc.data();
        cardList.push(card);
    });

    return Response.json(cardList);
}

export async function POST(req) {
    const body = await req.json();
    console.log("body:", body);
    // TODO: 透過dall-e-3模型讓AI產生圖片
    // 文件連結: https://platform.openai.com/docs/guides/images/usage
    const prompt = body.userInput;
    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
      });
      const imageURL = response.data[0].url;

    const card = {
        imageURL,
        prompt,
        createdAt: new Date().getTime()
    };
    // 把card存到資料庫
    db.collection(collectionName).add(card);
    return Response.json(card);
}