import React from "react";
import { WebRTCCtxProvider } from "./context/connection";
import Chat from "./Chat";
import { AlertCtxProvider } from "./context/alert";
import { UsersCtxProvider } from "./context/users";
import { MessagesCtxProvider } from "./context/messages";


const App = () => {
  return (
    <AlertCtxProvider>
      <UsersCtxProvider>
        <MessagesCtxProvider>
          <WebRTCCtxProvider>
              <Chat />
          </WebRTCCtxProvider>
        </MessagesCtxProvider>
      </UsersCtxProvider>
    </AlertCtxProvider>
  );
};
export default App;
