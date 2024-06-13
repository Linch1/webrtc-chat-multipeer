import React, { createContext, useState } from 'react';

const UsersCtx = createContext({
    users: [],
    updateUsersList: ({user}) => {},
    removeUser: ({user}) => {},
    setUsers: (users) => {},
    name: "", 
    setName: (name) => {}
});

export function UsersCtxProvider({ children }) {

    const [name, setName] = useState("");
    const [users, setUsers] = useState([]);
    const updateUsersList = ({ user }) => {
        setUsers(prev => [...prev, user]);
    };
    const removeUser = ({ user }) => {
        setUsers(prev => prev.filter(u => u.userName !== user.userName));
    }
	const context = {
        users, 
        updateUsersList,
        removeUser,
        setUsers,
        name, setName
	};

	return (
		<UsersCtx.Provider value={context}>
            {children}
        </UsersCtx.Provider>
	);
}

export default UsersCtx;
