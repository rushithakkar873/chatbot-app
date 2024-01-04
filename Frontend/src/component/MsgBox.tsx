type MessageType = "user" | "bot";
interface Message {
  type: MessageType;
  text: string;
}
interface MsgBoxProps {
  msg: Message;
}

const MsgBox: React.FC<MsgBoxProps> = ({ msg }) => {
  return (
    <>
      <div
        className={`mb-2 ${msg.type === "user" ? "text-right" : "text-left"}`}
      >
        <span
          className={`inline-block p-2 rounded ${
            msg.type === "user" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          {msg.text}
        </span>
      </div>
    </>
  );
};

export default MsgBox;
