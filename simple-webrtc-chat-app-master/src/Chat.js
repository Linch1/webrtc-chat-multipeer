import React, { Fragment, useContext } from "react";
import {
  Header,
  Icon,
  Input,
  Grid,
  Segment,
  Button,
  Loader
} from "semantic-ui-react";
import "./App.css";
import UsersList from "./UsersList";
import MessageBox from "./MessageBox";
import WebRTCCtx from "./context/connection";
import Login from "./Login";


const Chat = () => {
  let {socket} = useContext(WebRTCCtx);

  return (
    <div className="App">
      <Header as="h2" icon>
        <Icon name="users" />
        Simple WebRTC Chap App
      </Header>
      {(socket && (
        <Fragment>
          <Grid centered columns={4}>
            <Grid.Column>
              <Login />
            </Grid.Column>
          </Grid>
          <Grid>
            <UsersList />
            <MessageBox />
          </Grid>
        </Fragment>
      )) || (
        <Loader size="massive" active inline="centered">
          Loading
        </Loader>
      )}
    </div>
  );
};

export default Chat;
