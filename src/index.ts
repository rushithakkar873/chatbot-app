import express, { Express, Request, Response } from 'express';
import { config } from 'dotenv';
import OpenAI from 'openai';

// Load environment variables
config();

// Create a web server
const app: Express = express();
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Initialize OpenAI API
const openai: OpenAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

// Define a route to handle questions
app.get('/tell-me-about', async (req: Request, res: Response) => {
    // const prompt: string = req.body.prompt;
    // Call the OpenAI API to generate an answer
    const completion = await openai.completions.create({
        model: "text-davinci-003",
        // prompt: req.query.question,
        prompt: "How are you",
        max_tokens: 30,
    });
    res.send(completion.choices[0].text);
});

// Define route for personal coding tutor
app.get('/coding-tutor', async (req: Request, res: Response) => {
    const myAssistant = await openai.beta.assistants.create({
        instructions:
            "You are a personal coding tutor. When asked a question, wherever require, write and run Python code to answer the question.",
        name: "Coding Tutor",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-4",
    });
    console.log(myAssistant);
})

app.get('/', (req: Request, res: Response) => {
    res.send('hellooooooooo');
})