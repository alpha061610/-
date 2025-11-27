import { GoogleGenAI, Type } from "@google/genai";
import { RestaurantAnalysis } from "../types";

// Support both Vite env vars (import.meta.env) and standard process.env
const getApiKey = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    return import.meta.env.VITE_API_KEY;
  }
  return process.env.API_KEY;
};

const apiKey = getApiKey();

// Initialize AI only if key exists to prevent immediate crash, though functionality will fail
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getFoodFunFact = async (foodName: string): Promise<string> => {
  if (!ai) return "請設定 API Key";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Give me a very short, fun, 1-sentence appetizing fact or description about "${foodName}" in Traditional Chinese (Taiwanese style). Keep it under 30 words.`,
    });
    return response.text?.trim() || "這是一個絕佳的選擇，享受你的午餐吧！";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "這是一個絕佳的選擇，享受你的午餐吧！"; 
  }
};

export const getRestaurantAnalysis = async (restaurantName: string, address: string): Promise<RestaurantAnalysis> => {
  if (!ai) {
    return {
      positiveReviews: ["請先設定 API Key 才能使用 AI 分析功能。"],
      negativeReviews: [],
      atmosphere: "無法連線",
      diningAdvice: "無法連線"
    };
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        你是一位專業的台中美食評論家。請針對位於台中的餐廳「${restaurantName}」(地址約在: ${address}) 進行分析。
        
        請根據網路上公開的評論印象與你的知識庫，回傳一個 JSON 物件，包含以下資訊：
        1. "positiveReviews": 3則模擬的「正面」評論摘要，假設是網路上評分最高、字數最詳盡的評論。內容要具體描述好吃的餐點或優質服務。
        2. "negativeReviews": 3則模擬的「負面」評論摘要，假設是網路上評分較低但詳盡的評論。內容要具體（例如：要等很久、態度普通、價格偏高、環境吵雜等）。
        3. "atmosphere": 摘要該店的環境氛圍適合什麼情境（例如：適合約會、適合快速解決午餐、適合多人聚餐等）。
        4. "diningAdvice": 總結建議該店家適合「外帶」還是「內用」，並說明原因（例如：環境是否乾淨明亮、座位多寡）。

        請用繁體中文回答。
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            positiveReviews: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Three detailed positive review summaries"
            },
            negativeReviews: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Three detailed negative review summaries"
            },
            atmosphere: {
              type: Type.STRING,
              description: "Description of the atmosphere and suitable occasions"
            },
            diningAdvice: {
              type: Type.STRING,
              description: "Recommendation for Dine-in vs Takeout with reasoning"
            }
          }
        }
      }
    });

    const jsonStr = response.text?.trim();
    if (!jsonStr) throw new Error("Empty response");
    
    return JSON.parse(jsonStr) as RestaurantAnalysis;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      positiveReviews: ["無法取得評論摘要。", "無法取得評論摘要。", "無法取得評論摘要。"],
      negativeReviews: ["無法取得評論摘要。", "無法取得評論摘要。", "無法取得評論摘要。"],
      atmosphere: "資料讀取失敗",
      diningAdvice: "建議直接前往查看"
    };
  }
};