import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const ChatWidget = ({ user }) => {
    const [socket, setSocket] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [recipient, setRecipient] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/tutoring/users-with-messages/');
                setUsers(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (user && recipient) {
            const ws = new WebSocket(`ws://localhost:8000/ws/chat/${encodeURIComponent(user.email)}/${recipient}/`);
            setSocket(ws);

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, message]);
            };

            ws.onclose = () => {
                console.log('WebSocket connection closed');
            };

            return () => {
                ws.close();
            };
        }
    }, [user, recipient]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = () => {
        if (newMessage.trim() && recipient.trim() && socket) {
            const message = {
                message: newMessage,
                recipient: recipient,
            };
            socket.send(JSON.stringify(message));
            setMessages((prevMessages) => [...prevMessages, { sender: 'You', content: newMessage }]);
            setNewMessage('');
        }
    };

    const handleUserClick = async (username) => {
        setRecipient(username);
        try {
            const response = await axios.get(`/api/tutoring/messages/?recipient=${username}`);
            setMessages(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fixed bottom-4 right-4">
            {isOpen ? (
                <div className="w-96 h-[30rem] bg-indigo-500 shadow-lg rounded-lg flex flex-col">
                    <div className="flex justify-between items-center p-2 border-b border-indigo-700">
                        <h2 className="text-lg font-medium text-white">Chat</h2>
                        <button onClick={toggleChat} className="text-gray-200 hover:text-white">
                            X
                        </button>
                    </div>
                    <div className="flex">
                        <div className="w-1/3 bg-indigo-200 p-2 overflow-y-auto">
                            {users.map((user) => (
                                <div
                                    key={user.username}
                                    className="p-2 cursor-pointer hover:bg-indigo-300"
                                    onClick={() => handleUserClick(user.username)}
                                >
                                    {user.username}
                                </div>
                            ))}
                        </div>
                        <div className="w-2/3 flex flex-col">
                            <div className="flex-1 p-2 overflow-y-auto bg-indigo-100">
                                {messages.map((message, index) => (
                                    <div key={index} className={`p-2 ${message.sender === 'You' ? 'text-right' : 'text-left'}`}>
                                        <strong>{message.sender}:</strong> {message.content}
                                    </div>
                                ))}
                            </div>
                            <div className="p-2 border-t border-indigo-700">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="w-full p-2 border rounded"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="w-full mt-2 p-2 bg-indigo-600 text-white rounded"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    onClick={toggleChat}
                    className="w-16 h-16 bg-indigo-500 text-white rounded-full shadow-lg flex items-center justify-center"
                >
                    💬
                </button>
            )}
        </div>
    );
};

export default ChatWidget;