import { Configuration, OpenAIApi } from "openai";
import { BasePrompt } from "./prompts/BasePrompt";

export default class ChatGPTClient {
    private openAIClient: OpenAIApi

    constructor() {
        const config = new Configuration({
            apiKey: "<ENTER OPENAI KEY>",
        });

        this.openAIClient = new OpenAIApi(config);
    }

    async createChatCompletion(prompt: BasePrompt) {
        return await this.openAIClient.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: prompt,
            temperature: 0.7,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        });
    }
}