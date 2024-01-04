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
const cors_1 = __importDefault(require("cors"));
// Load environment variables
(0, dotenv_1.config)();
// Create a web server
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
// Enable CORS for all routes and origins
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173' // Replace with your frontend's origin
}));
// Initialize OpenAI API
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});
// Middlewares for parsing JSON and URL-encoded data
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Define route for personal coding tutor
app.post('/coding-tutor', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userQue = req.body.question;
        // console.log(userQue);
        if (!userQue) {
            return res.status(400).send('Question is required');
        }
        // Step-1 create an assistant
        const myAssistant = yield openai.beta.assistants.create({
            instructions: "You are a personal coding tutor. When asked a question, whenever require, write and run Python code to answer the question.",
            name: "Coding Tutor",
            tools: [{ type: "code_interpreter" }],
            model: "gpt-3.5-turbo-1106",
        });
        // console.log(myAssistant);
        // Step-2 create a thread
        const thread = yield openai.beta.threads.create();
        // console.log(thread);
        // Step-3 add msg to thread
        yield openai.beta.threads.messages.create(thread.id, {
            role: "user",
            // content: "I need to understand the working of bfs and dfs and differences between them. Can you help me?"
            content: userQue
        });
        // Step-4 run the assistant
        const run = yield openai.beta.threads.runs.create(thread.id, {
            assistant_id: myAssistant.id,
            instructions: "Address the user in a friendly manner."
        });
        // console.log(run);
        // Step-5 check the run status and wait for completion
        let runStatus = yield openai.beta.threads.runs.retrieve(thread.id, run.id);
        while (runStatus.status !== "completed") {
            // console.log(runStatus);
            yield new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 second before checking again
            runStatus = yield openai.beta.threads.runs.retrieve(thread.id, run.id);
        }
        // Step-6 display the assistant's response
        const messages = yield openai.beta.threads.messages.list(thread.id);
        // console.log(messages);
        // res.json(messages.data);
        // res.json({ responses: messages.data.filter(msg => msg.role === 'assistant') });
        const assistantResponses = messages.data.filter(msg => msg.role === 'assistant');
        const latestRes = assistantResponses[assistantResponses.length - 1];
        res.json(latestRes);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}));
app.get('/', (req, res) => {
    res.send('helloooooooooo');
});
// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
