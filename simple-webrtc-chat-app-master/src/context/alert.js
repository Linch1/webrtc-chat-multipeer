import React, { createContext, useState } from 'react';

const AlertCtx = createContext({
    setAlert: component => {},
    closeAlert: () => {}
});

export function AlertCtxProvider({ children }) {

    const [alertBox, setAlert] = useState(null);
    function closeAlert(){
        setAlert(null);
    }

	const context = {
        alertBox, setAlert,
        closeAlert
	};

    

	return (
		<AlertCtx.Provider value={context}>
            {alertBox}
            {children}
        </AlertCtx.Provider>
	);
}

export default AlertCtx;
