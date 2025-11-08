
import { GoogleGenAI, GenerateContentResponse, Content } from "@google/genai";
import { ChatMessage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        throw new Error("No image generated");
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
};

export const getChatResponse = async (history: ChatMessage[], newMessage: string, useThinkingMode: boolean): Promise<string> => {
    const modelName = useThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    const config = useThinkingMode ? { thinkingConfig: { thinkingBudget: 32768 } } : {};
    
    const contents: Content[] = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: newMessage }] });

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: config,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting chat response:", error);
        return "عذراً، حدث خطأ ما. حاول مرة أخرى.";
    }
};
