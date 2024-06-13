import React, { createContext, useState } from 'react';

const CountCtx = createContext({
    count:0,
    increaseCount: () => {}
});

export function CountCtxProvider({ children }) {

    const [count, setCount] = useState(null);

    function increaseCount() {
        console.log(count);
        setCount(count+1);
    }
	const context = {
        count, increaseCount
	};


	return (
		<CountCtx.Provider value={context}>
            {children}
        </CountCtx.Provider>
	);
}

export default CountCtx;
