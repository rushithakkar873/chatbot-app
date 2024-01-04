import React, { useState } from "react";
import MsgBox from "./MsgBox";
import axios from "axios";

type MessageType = "user" | "bot";
interface Message {
  type: MessageType;
  text: string;
}

const Home: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (question.trim() === "") return;

    // Add user's question to messages
    setMessages([...messages, { type: "user", text: question }]);

    // Here you would add the logic to send the question to your server
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/coding-tutor", {
        question: question,
      });
      console.log(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }

    // For now, let's simulate a bot response
    const botResponse = `Echo: ${question}`;
    setMessages((messages) => [
      ...messages,
      { type: "bot", text: botResponse },
    ]);

    setQuestion(""); // Clear input field
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Coding Tutor Chatbot
          </h1>

          <div className="mb-4 h-96 overflow-y-auto bg-gray-100 p-4 rounded">
            {messages.map((message, index) => (
              <MsgBox key={index} msg={message} />
            ))}
            {loading ? <h3>Typing.....</h3> : <></>}
          </div>

          <div className="flex">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(event) => event.key === "Enter" && sendMessage()}
              placeholder="Type your question..."
              className="flex-1 p-2 border-2 border-gray-300 rounded-l-md"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white font-bold p-2 rounded-r-md hover:bg-blue-700 transition duration-300"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
