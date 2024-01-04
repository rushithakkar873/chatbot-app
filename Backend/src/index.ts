import express, { Express, Request, Response } from 'express';
import { config } from 'dotenv';
import OpenAI from 'openai';
import cors from 'cors';

// Load environment variables
config();

// Create a web server
const app: Express = express();
const port = process.env.PORT || 4000;

// Enable CORS for all routes and origins
app.use(cors({
    origin: 'http://localhost:5173' // Replace with your frontend's origin
}));

// Initialize OpenAI API
const openai: OpenAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

// Middlewares for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define route for personal coding tutor
app.post('/coding-tutor', async (req: Request, res: Response) => {
    try {
        const userQue = req.body.question;
        // console.log(userQue);

        if (!userQue) {
            return res.status(400).send('Question is required');
        }

        // Step-1 create an assistant
        const myAssistant = await openai.beta.assistants.create({
            instructions: "You are a personal coding tutor. When asked a question, whenever require, write and run Python code to answer the question.",
            name: "Coding Tutor",
            tools: [{ type: "code_interpreter" }],
            model: "gpt-3.5-turbo-1106",
        });
        // console.log(myAssistant);

        // Step-2 create a thread
        const thread = await openai.beta.threads.create();
        // console.log(thread);

        // Step-3 add msg to thread
        await openai.beta.threads.messages.create(
            thread.id,
            {
                role: "user",
                // content: "I need to understand the working of bfs and dfs and differences between them. Can you help me?"
                content: userQue
            }
        );

        // Step-4 run the assistant
        const run = await openai.beta.threads.runs.create(
            thread.id,
            {
                assistant_id: myAssistant.id,
                instructions: "Address the user in a friendly manner."
            }
        );
        // console.log(run);

        // Step-5 check the run status and wait for completion
        let runStatus = await openai.beta.threads.runs.retrieve(
            thread.id,
            run.id
        );

        while (runStatus.status !== "completed") {
            // console.log(runStatus);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 second before checking again
            runStatus = await openai.beta.threads.runs.retrieve(
                thread.id,
                run.id
            );
        }

        // Step-6 display the assistant's response
        const messages = await openai.beta.threads.messages.list(
            thread.id
        );
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
})

app.get('/', (req: Request, res: Response) => {
    res.send('helloooooooooo');
})

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});