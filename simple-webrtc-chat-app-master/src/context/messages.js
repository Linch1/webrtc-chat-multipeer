import { format } from 'date-fns';
import React, { createContext, useState } from 'react';

const MessagesCtx = createContext({
    messages: {},
    handleDataChannelMessageReceived: ({ data }, connectedTo) => {},
    sendMsg: (channels, name, connectedTo, data) => {}
});

export function MessagesCtxProvider({ children }) {

    const [messages, setMessages] = useState({});

    const handleDataChannelMessageReceived = ({ data }, connectedTo) => {
        const message = JSON.parse(data);
        let userMessages = messages[JSON.stringify(connectedTo)];
        userMessages = [...(userMessages||[]), message];
        setMessages( old => ({...old, [JSON.stringify(connectedTo)]: userMessages}));
    };

    //when a user clicks the send message button
    const sendMsg = (channels, name, connectedTo, data) => {

        const time = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
        let text = { time, data, name };

        let userMessages = messages[JSON.stringify(connectedTo)];
        userMessages = [...(userMessages||[]), text];

        setMessages( old => ({...old, [JSON.stringify(connectedTo)]: userMessages}));

        for ( let channel of Object.values(channels) ){
            channel.send(JSON.stringify(text));
        }
        
    };

	const context = {
        handleDataChannelMessageReceived,
        messages,
        sendMsg
	};

	return (
		<MessagesCtx.Provider value={context}>
            {children}
        </MessagesCtx.Provider>
	);
}

export default MessagesCtx;
