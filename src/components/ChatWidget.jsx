import React, { useState, useEffect, useRef } from 'react';
import axios from '../axiosConfig';

const ChatWidget = ({ user }) => {
    const [socket, setSocket] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [recipient, setRecipient] = useState('');
    const [users, setUsers] = useState([]);
    const messagesEndRef = useRef(null); // Reference to the end of the messages container

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
            if (socket) {
                socket.close();
            }

            const wsUrl = `ws://localhost:8000/ws/chat/?sender=${encodeURIComponent(user.email)}&recipient=${encodeURIComponent(recipient)}`;
            const ws = new WebSocket(wsUrl);
            setSocket(ws);

            ws.onopen = () => {
                console.log('WebSocket connection opened');
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, message]);
            };

            ws.onclose = () => {
                console.log('WebSocket connection closed');
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            return () => {
                if (ws) {
                    ws.close();
                }
            };
        }
    }, [user, recipient]);

    // Scroll to the bottom of the messages
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Scroll to the bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            // Ensure the chat scrolls to the bottom when opened
            setTimeout(scrollToBottom, 0);
        }
    };

    const handleSendMessage = () => {
        if (newMessage.trim() && recipient.trim() && socket) {
            const message = {
                message: newMessage,
                recipient: recipient,
                sender: user,
            };
            socket.send(JSON.stringify(message));
            setNewMessage('');
        }
    };

    const handleRecipientChange = async (email) => {
        setRecipient(email);
        try {
            const response = await axios.get(`/api/tutoring/messages/?recipient=${encodeURIComponent(email)}`);
            const messagesWithSender = response.data.map((msg) => ({
                ...msg,
                senderIsCurrentUser: msg.sender.email === user.email,
            }));
            setMessages(messagesWithSender);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fixed bottom-4 right-4">
            {isOpen ? (
                <div className="w-96 h-[36rem] bg-white shadow-lg rounded-lg flex flex-col border">
                    <div className="flex justify-between items-center p-4 bg-indigo-600 text-white rounded-t-lg">
                        <h2 className="text-lg font-medium">Chat</h2>
                        <button onClick={toggleChat} className="text-white hover:text-gray-300">
                            ✕
                        </button>
                    </div>

                    <div className="p-4 bg-gray-100 border-b">
                        <label className="block text-gray-700 text-sm mb-2">Select a recipient:</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={recipient}
                            onChange={(e) => handleRecipientChange(e.target.value)}
                        >
                            <option value="">-- Choose a recipient --</option>
                            {users.map((user) => (
                                <option key={user.email} value={user.email}>
                                    {user.first_name} {user.last_name} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    {recipient ? (
                        <div className="flex-1 flex flex-col min-h-0">
                            <div
                                className="flex-1 p-4 bg-gray-50 overflow-y-auto max-h-[28rem]"
                                style={{ overflowY: 'auto' }}
                            >
                                {messages.map((message, index) => {
                                    const isCurrentUser =
                                        message.senderIsCurrentUser ||
                                        (message.sender && message.sender.email === user.email);
                                    return (
                                        <div
                                            key={index}
                                            className={`mb-2 flex ${
                                                isCurrentUser ? 'justify-end' : 'justify-start'
                                            }`}
                                        >
                                            <div
                                                className={`inline-block px-4 py-2 rounded-lg ${
                                                    isCurrentUser
                                                        ? 'bg-indigo-500 text-white'
                                                        : 'bg-gray-200 text-gray-800'
                                                }`}
                                            >
                                                <strong>
                                                    {isCurrentUser
                                                        ? 'You'
                                                        : `${
                                                            message.sender
                                                                ? `${message.sender.first_name} ${message.sender.last_name}`
                                                                : 'Unknown Sender'
                                                        }`}
                                                    :
                                                </strong>{' '}
                                                {message.content}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef}></div>
                            </div>
                            <div className="p-4 border-t bg-white flex items-center">
                                <input
                                    type="text"
                                    className="flex-1 border rounded-lg p-2 mr-2"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button
                                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg"
                                    onClick={handleSendMessage}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            <p>Select a recipient to start chatting.</p>
                        </div>
                    )}
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
