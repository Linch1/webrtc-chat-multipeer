import React, { useContext, useState } from "react";
import {
  Header,
  Icon,
  Input,
  Grid,
  Segment,
  Card,
  Sticky,
  Button,
  Comment
} from "semantic-ui-react";
import { formatRelative } from "date-fns";
import avatar from "./avatar.png";
import MessagesCtx from "./context/messages";
import WebRTCCtx from "./context/connection";
import UsersCtx from "./context/users";

const MessageBox = ({}) => {

  const {connectedTo, channels} = useContext(WebRTCCtx);
  const {name} = useContext(UsersCtx);
  const {messages, sendMsg} = useContext(MessagesCtx);
  const [message, setMessage] = useState("");




  return (
    <Grid.Column width={11}>
      <Sticky>
        <Card fluid>
          <Card.Content
            header={
              connectedTo.length ? JSON.stringify(connectedTo) : "Not chatting with anyone currently"
            }
          />
          <Card.Content>
            {connectedTo && messages[JSON.stringify(connectedTo)] ? (
              <Comment.Group>
                {messages[JSON.stringify(connectedTo)].map(({ name: sender, data: text, time }) => (
                  <Comment key={`msg-${name}-${time}`}>
                    <Comment.Avatar src={avatar} />
                    <Comment.Content>
                      <Comment.Author>{sender === name ? 'You' : sender}</Comment.Author>
                      <Comment.Metadata>
                        <span>
                          {formatRelative(new Date(time), new Date())}
                        </span>
                      </Comment.Metadata>
                      <Comment.Text>{text}</Comment.Text>
                    </Comment.Content>
                  </Comment>
                ))}
              </Comment.Group>
            ) : (
              <Segment placeholder>
                <Header icon>
                  <Icon name="discussions" />
                  No messages available yet
                </Header>
              </Segment>
            )}
            <Input
              fluid
              type="text"
              value={message}
              onChange={e => {
                setMessage(e.target.value)
              }}
              placeholder="Type message"
              action
            >
              <input />
              <Button color="teal" disabled={!message} onClick={()=>{
                sendMsg(channels, name, connectedTo, message)
                setMessage("");
              }}>
                <Icon name="send" />
                Send Message
              </Button>
            </Input>
          </Card.Content>
        </Card>
      </Sticky>
    </Grid.Column>
  );
};

export default MessageBox;
