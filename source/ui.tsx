import React, { FC } from "react";
import { Text } from "ink";
import { TCliOptions, useAppState } from "./state";

const App: FC<Partial<TCliOptions>> = (cliOptions) => {
	const [state, ] = useAppState(cliOptions);
	if (!state.url) {
		return;
	}
	return (
		<Text>
			Hello, <Text color="green">{url}</Text>
		</Text>
	);
};

module.exports = App;
export default App;
