import { GoogleGenAI } from "@google/genai";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is missing. Set it in your .env file.");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const MODEL_NAME = "gemini-3.6-flash";

const convertImageToBase64 = async (uri) => {
  try {
    if (Platform.OS === "web") {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result.split(",")[1];
          resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } else {
      return await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }
  } catch (error) {
    console.error("Base64 Conversion Error:", error);
    throw error;
  }
};

const isAuthError = (error) =>
  error.message?.includes("API key") ||
  error.message?.includes("API_KEY_INVALID") ||
  error.message?.includes("UNAUTHENTICATED") ||
  error.message?.includes("401");

const isRateLimitError = (error) =>
  error.message?.includes("429") || error.message?.includes("quota");

const makeTimestamp = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const analyzePlantImage = async (imageUri) => {
  try {
    const base64Image = await convertImageToBase64(imageUri);

    const prompt = `
      You are PlantBot, an expert AI botanist and plant pathologist.
      Analyze this image of a plant/leaf.
      Respond strictly in JSON format matching this structure:
      {
        "text": "Brief diagnostic introduction",
        "diagnosis": {
          "issue": "Identified disease/issue or Healthy",
          "confidence": "Estimated confidence percentage",
          "severity": "Low/Moderate/High or None",
          "treatment": "Step by step treatment advice",
          "fertilizer": "Recommended organic/inorganic fertilizer",
          "shopItems": ["Product name 1 ($Price)", "Product name 2 ($Price)"]
        },
        "suggestedChips": ["Follow-up question 1", "Follow-up question 2", "Follow-up question 3"]
      }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    const responseText = response.text;
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleanJson);

    return {
      id: String(Date.now()),
      sender: "bot",
      text: parsedData.text,
      imageUri: imageUri,
      diagnosis: parsedData.diagnosis,
      suggestedChips: parsedData.suggestedChips || [
        "Watering Needs",
        "Sunlight Requirements",
        "Prevention Tips",
      ],
      timestamp: makeTimestamp(),
    };
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return {
      id: String(Date.now()),
      sender: "bot",
      text: isAuthError(error)
        ? "Invalid or unsupported API key. Please check your Gemini API key configuration."
        : isRateLimitError(error)
        ? "Free tier rate limit reached. Please wait 10 seconds and try again."
        : "I had trouble reading that image clearly. Please try again!",
      timestamp: makeTimestamp(),
    };
  }
};

export const getBotResponse = async (userText) => {
  try {
    const systemPrompt = `
      You are PlantBot, an AI gardening assistant for the MyPlantPal app.
      Answer the user's gardening question accurately, concisely, and helpfully.
      Keep answers directly under 100 words.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userText,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    const responseText = response.text;

    return {
      id: String(Date.now()),
      sender: "bot",
      text: responseText,
      suggestedChips: [
        "How often to water?",
        "Fertilizer guide",
        "Pest prevention",
      ],
      timestamp: makeTimestamp(),
    };
  } catch (error) {
    console.error("Gemini Text API Error:", error);
    return {
      id: String(Date.now()),
      sender: "bot",
      text: isAuthError(error)
        ? "Invalid or unsupported API key. Please check your Gemini API key configuration."
        : isRateLimitError(error)
        ? "Free tier rate limit reached. Please wait 10 seconds before asking again!"
        : "I am having trouble connecting to my plant knowledge base. Please check your connection.",
      timestamp: makeTimestamp(),
    };
  }
};