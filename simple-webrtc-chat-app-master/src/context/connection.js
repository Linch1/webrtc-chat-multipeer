import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import EventsDispatcher from '../utils/EventsDispatcher';
import SweetAlert from 'react-bootstrap-sweetalert';
import AlertCtx from './alert';
import UsersCtx from './users';
import MessagesCtx from './messages';

const WebRTCCtx = createContext({
	connection: null,
    channel: null,
    socket: null,
    send: data => {},
    setupRtcConnection: () => {},

    toggleConnection: () => {},
    connectedTo: [],
    connecting: false
});

export function WebRTCCtxProvider({ children }) {

    let {setAlert, closeAlert} = useContext( AlertCtx );
    let {updateUsersList, removeUser} = useContext(UsersCtx);
    let {messages, handleDataChannelMessageReceived} = useContext(MessagesCtx);

    let [socket, setSocket] = useState(null);
    let [connections, setConnections] = useState({});
    let [channels, setChannels] = useState({});

    let [connectedTo, setConnectedTo] = useState([]);

    let [connecting, setConnecting] = useState({});



    

    useEffect( () => {
        let _socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
        _socket.onmessage = message => {
          const data = JSON.parse(message.data);
          onSocketMessage(data);
        };
        _socket.onclose = (e) => {
          window.alert("closing connection from: "+process.env.REACT_APP_WEBSOCKET_URL + " code:" + JSON.stringify(e))
          _socket.close();
        };
        _socket.onerror = (e) => window.alert('ERROR' + JSON.stringify(e));
        _socket.onopen = () => setSocket(_socket);
        return () => _socket.close();
    }, [])

    
    

    const send = data => {
        if(!socket) return;
        socket.send(JSON.stringify(data));
    };

    

    useEffect( () => {
        if(!channels) return;
        for( let channel of Object.values(channels) ){
            channel.onmessage = (data) => {
                handleDataChannelMessageReceived(data, connectedTo);
            };
        }
    }, [handleDataChannelMessageReceived, channels, connectedTo])


    
    //when somebody wants to message us
    const onOffer = ({ offer, name }) => {

        setConnecting( old => ({...old, [name]: true }));
        let connection = setupRtcConnection(name);

        connection
        .setRemoteDescription(new RTCSessionDescription(offer))
        .then(() => connection.createAnswer())
        .then(answer => connection.setLocalDescription(answer))
        .then(() =>
            send({ type: "answer", answer: connection.localDescription, name })
        )
        .catch(e => {
            setAlert(
                <SweetAlert
                    warning
                    confirmBtnBsStyle="danger"
                    title="Failed"
                    onConfirm={closeAlert}
                    onCancel={closeAlert}
                >
                    An error has occurred.
                </SweetAlert>
            );
        });
    }

    //when another user answers to our offer
    const onAnswer = ({ answer, name }) => {
        if(!connections[name]) return console.log("Missing connection");
        connections[name].setRemoteDescription(new RTCSessionDescription(answer));
    }

    //when we got ice candidate from another user
    const onCandidate = ({ candidate, name }) => {
        if(!connections[name]) return console.log("Missing connection");
        connections[name].addIceCandidate(new RTCIceCandidate(candidate));
    }

    const setupRtcConnection = (userName) => {
        let localConnection = new RTCPeerConnection({ iceServers: [{ url: "stun:stun.1.google.com:19302" }] });
        //when the browser finds an ice candidate we send it to another peer
        localConnection.onicecandidate = ({ candidate }) => {
            if (candidate && userName) {
                send({
                    name: userName,
                    type: "candidate",
                    candidate
                });
            }
        };
        localConnection.ondatachannel = event => {
            console.log("Data channel is created!");
            let receiveChannel = event.channel;
            receiveChannel.onopen = () => {
                console.log("Data channel is open and ready to be used.");
            };
            setConnectedTo( old => [...old, userName]);
            setConnecting( old => ({...old, [userName]: false}));
            setChannels(old => ({...old, [userName]: receiveChannel}));
        };
        setConnections(old => ({...old, [userName]: localConnection}));

        return localConnection;
    }
    const handleConnection = (connection, name) => {

        let dataChannel = connection.createDataChannel("messenger");
        dataChannel.onerror = error => {
            setAlert(
                <SweetAlert
                warning
                confirmBtnBsStyle="danger"
                title="Failed"
                onConfirm={closeAlert}
                onCancel={closeAlert}
                >
                    An error has occurred.
                </SweetAlert>
            );
        };

        let newConnectedTo = [...connectedTo, name];
        dataChannel.onmessage = (data) => {
            handleDataChannelMessageReceived(data, newConnectedTo);
        };
        setConnectedTo( old => newConnectedTo);
        setConnecting( old=> ({...old, [name]: false}) )
        setChannels(old => ({...old, [name]: dataChannel}));

        connection
            .createOffer()
            .then(offer => connection.setLocalDescription(offer))
            .then(() =>
                send({ type: "offer", offer: connection.localDescription, name })
            )
            .catch(e =>
                setAlert(
                <SweetAlert
                    warning
                    confirmBtnBsStyle="danger"
                    title="Failed"
                    onConfirm={closeAlert}
                    onCancel={closeAlert}
                >
                    An error has occurred.
                </SweetAlert>
                )
            );
    };

    const toggleConnection = (userName) => {
        if(connections[userName]){
            //TODO: disconnect
        } else {
            setConnecting(old => ({...old, [userName]: true}))
            let localConnection = setupRtcConnection(userName);
            handleConnection(localConnection, userName)
        }
    }
    

    const onSocketMessage = (data) => {
        if (data) {
            EventsDispatcher.dispatchEvent(data.type, data);
            switch (data.type) {
                case "updateUsers":
                    updateUsersList(data);
                    break;
                case "removeUser":
                    removeUser(data);
                    break;
                case "offer":
                    onOffer(data);
                    break;
                case "answer":
                    onAnswer(data);
                    break;
                case "candidate":
                    onCandidate(data);
                    break;
                default:
                    break;
            }
        }
    };
    
    useEffect( () => {
        if(!socket) return;
        socket.onmessage = message => {
            const data = JSON.parse(message.data);
            onSocketMessage(data);
        };
    }, [socket, onSocketMessage])

	const context = {
        connections,
        channels,
        send,
        setupRtcConnection,
        socket,
        
        toggleConnection, connectedTo, connecting
	};

	return (
		<WebRTCCtx.Provider value={context}>{children}</WebRTCCtx.Provider>
	);
}

export default WebRTCCtx;
