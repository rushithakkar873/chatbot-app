"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const openai_1 = __importDefault(require("openai"));
// Load environment variables
(0, dotenv_1.config)();
// Create a web server
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
// Initialize OpenAI API
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});
// Define a route to handle questions
app.get('/tell-me-about', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const prompt: string = req.body.prompt;
    // Call the OpenAI API to generate an answer
    const completion = yield openai.completions.create({
        model: "text-davinci-003",
        // prompt: req.query.question,
        prompt: "How are you",
        max_tokens: 30,
    });
    res.send(completion.choices[0].text);
}));
// Define route for personal coding tutor
app.get('/coding-tutor', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const myAssistant = yield openai.beta.assistants.create({
        instructions: "You are a personal coding tutor. When asked a question, wherever require, write and run Python code to answer the question.",
        name: "Coding Tutor",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-4",
    });
    console.log(myAssistant);
}));
app.get('/', (req, res) => {
    res.send('hellooooooooo');
});
