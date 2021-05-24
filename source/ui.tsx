import React, { FC, useEffect, useState } from "react";
import { Text, useApp } from "ink";
import { TCliOptions, useAppState } from "./state";

const App: FC<Partial<TCliOptions>> = (cliOptions) => {
	const {exit} = useApp();
	const [state, next] = useAppState(cliOptions);
	useEffect(() => {
		if(state.lastAction !== `END`) {
			next();
		}

		// const keepAlive = setInterval(() => {}, 1000000);
		// return () => {
		// 	clearInterval(keepAlive);
		// };
	}, [state.lastAction]);

	if (state.error) {
		return <Text color="red">Error: {state.error}.</Text>;;
	}

	return <Text color="green">{state.config.url} tests passed</Text>;
};

export default App;
