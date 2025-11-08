
export interface StoryStep {
  title: string;
  imagePrompt: string;
  imageUrl: string | null;
  text: string;
  angerLevel: number;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}
