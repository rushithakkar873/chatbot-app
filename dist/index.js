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
// Initialize OpenAI API
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});
// Middlewares for parsing JSON and URL-encoded data
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Define route for personal coding tutor
app.get('/coding-tutor', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Step-1 create an assistant
    const myAssistant = yield openai.beta.assistants.create({
        instructions: "You are a personal coding tutor. When asked a question, whenever require, write and run Python code to answer the question.",
        name: "Coding Tutor",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-3.5-turbo-1106",
    });
    console.log(myAssistant);
    // Step-2 create a thread
    const thread = yield openai.beta.threads.create();
    console.log(thread);
    // Step-3 add msg to thread
    const message = yield openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: "I need to understand the working of bfs and dfs and differences between them. Can you help me?"
    });
    console.log(message);
    // Step-4 run the assistant
    const run = yield openai.beta.threads.runs.create(thread.id, {
        assistant_id: myAssistant.id,
        instructions: "Please address the user as Baba Aadam. The user has a premium account."
    });
    console.log(run);
    // Step-5 check the run status
    let status = "";
    while (status !== "completed") {
        const runRetrieve = yield openai.beta.threads.runs.retrieve(thread.id, run.id);
        console.log(runRetrieve);
        status = runRetrieve.status;
    }
    // Step-6 display the assistant's response
    const messages = yield openai.beta.threads.messages.list(thread.id);
    console.log(messages);
    res.send(messages);
}));
app.get('/', (req, res) => {
    res.send('helloooooooooo');
});
// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
