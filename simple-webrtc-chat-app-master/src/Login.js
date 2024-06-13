import React, { useContext, useEffect, useState } from "react";
import WebRTCCtx from "./context/connection";
import AlertCtx from "./context/alert";
import EventsDispatcher from "./utils/EventsDispatcher";
import SocketEvents from "./enums/SocketEvents";
import UsersCtx from "./context/users";
import SweetAlert from "react-bootstrap-sweetalert";
import { Button, Icon, Input, Segment } from "semantic-ui-react";

export default function Login({}){

    const {send} = useContext(WebRTCCtx)
    const {setAlert, closeAlert} = useContext(AlertCtx);
    const {name, setName, setUsers} = useContext(UsersCtx);
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggingIn, setLoggingIn] = useState(false);
    

    const onLogin = (type, { success, message, users: loggedIn }) => {
        if(type != SocketEvents.login) return;
        setLoggingIn(false);
        if (success) {
          setAlert(
            <SweetAlert
              success
              title="Success!"
              onConfirm={closeAlert}
              onCancel={closeAlert}
            >
              Logged in successfully!
            </SweetAlert>
          );
          setIsLoggedIn(true);
          setUsers(loggedIn);
        } else {
          setAlert(
            <SweetAlert
              warning
              confirmBtnBsStyle="danger"
              title="Failed"
              onConfirm={closeAlert}
              onCancel={closeAlert}
            >
              {message}
            </SweetAlert>
          );
        }
    }


    useEffect( () => {
        EventsDispatcher.addListener(onLogin);
        return () => EventsDispatcher.removeListener(onLogin);
    }, [onLogin]);

    return (
        !isLoggedIn ?
            <Input
                fluid
                disabled={loggingIn}
                type="text"
                onChange={e => setName(e.target.value)}
                placeholder="Username..."
                action
            >
                <input />
                <Button
                color="teal"
                disabled={!name || loggingIn}
                onClick={() => {
                    setLoggingIn(true);
                    send({
                        type: "login",
                        name
                    });
                }}
                >
                <Icon name="sign-in" />
                Login
                </Button>
            </Input>
        :
        <Segment raised textAlign="center" color="olive">
            Logged In as: {name}
        </Segment>
    )
    
}