import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import { Text, useApp } from "ink";
import Spinner from "ink-spinner";
import Table from "ink-table";
import terminalLink from "terminal-link";
import { TCliOptions, useAppState } from "./state";
import { TContractData } from "./etherscan-api";
import chalk from "chalk";

const formatAddressType = (row: TContractData) => {
	if (row.error) return `⚡️ ${chalk.red(row.error.slice(0, 50))}`;
	else if (row.isContract) {
		let name = ``;
		if (row.contractName && row.tokenTracker) {
			name = chalk.magenta`${row.contractName} [${row.tokenTracker}]`;
		} else if (row.contractName || row.tokenTracker) {
			name = chalk.blue`${row.contractName || row.tokenTracker}`;
		} else {
			name = chalk.gray`Unverified`;
		}
		return `🤖 ${name}`;
	} else {
		return `👤 ${chalk.white("EOA")}`;
	}
};

const App: FC<Partial<TCliOptions>> = (cliOptions) => {
	const { exit } = useApp();
	const [state, next] = useAppState(cliOptions);
	useEffect(() => {
		if (state.lastAction !== `END`) {
			next();
		}

		// const keepAlive = setInterval(() => {}, 1000000);
		// return () => {
		// 	clearInterval(keepAlive);
		// };
	}, [state.lastAction]);

	if (state.error) {
		return <Text color="red">Error: {state.error}.</Text>;
	}

	// last screen is contract data table
	if (typeof state.result.addressesData !== `undefined`) {
		const data = state.result.addressesData.map((row) => ({
			address: terminalLink(row.address, row.url, { fallback: () => row.url }),
			type: formatAddressType(row),
		}));
		return <Table data={data} />;
	}

	// if (typeof state.result.addresses !== `undefined`) {
	// 	const data = state.result.addresses.map((addr) => ({ address: addr }));
	// 	return <Table data={data} />;
	// }

	return (
		<Text>
			<Text color="green">
				<Spinner type="dots" />
			</Text>
			<Text color="lightblue"> {state.info}</Text>
		</Text>
	);
};

export default App;
