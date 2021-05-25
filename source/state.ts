import { useState } from "react";
import scrape from "website-scraper";
import { URL } from "url";
import fs from "fs";
import path from "path";
import os from "os";
import glob from "glob";
import { sleep } from "./utils";

export type ValidChains = "eth" | "bsc";
export type TActions = "INIT" | "SCRAPE" | "END";
const getNextAction = (action: TActions) => {
	const ordered: TActions[] = [`INIT`, `SCRAPE`, `END`];
	const currentIndex = ordered.findIndex((s) => s === action);
	if (currentIndex < 0) throw new Error(`Invalid action "${action}"`);
	if (currentIndex === ordered.length - 1)
		throw new Error(`Last action repeatedly called`);

	return ordered[currentIndex + 1]!;
};

export type TCliOptions = { url: string; chain: ValidChains };
export type TReducerAction<T> = { type: T; payload: any };
type TState = {
	lastAction: TActions;
	error: string;
	info: string;
	config: TCliOptions;
};
const getDefaultState = (options: Partial<TCliOptions>): TState => ({
	lastAction: `INIT`,
	error: ``,
	info: `Scraping ${options.url} ...`,
	config: {
		// url: options.url || `https://yearn.finance/vaults`,
		url: options.url || `https://bdo.money`,
		chain: options.chain || `eth`,
	},
});

async function reducer(
	state: TState
	// action: TReducerAction<TActions>
): Promise<TState> {
	const nextAction = getNextAction(state.lastAction);
	const newState: TState = {
		...state,
		lastAction: nextAction,
	};
	switch (nextAction) {
		case "SCRAPE": {
			if (!state.config.url) {
				return {
					...newState,
					error: `Missing --url parameter`,
					lastAction: `END`,
				};
			} else if (![`eth`, `bsc`].includes(state.config.chain)) {
				return {
					...newState,
					error: `Missing/invalid --chain parameter`,
					lastAction: `END`,
				};
			}

			await sleep(5000);
			let tmpDir = ``;
			try {
				tmpDir = await path.join(os.tmpdir(), "scrape-eth");
				if (fs.existsSync(tmpDir)) {
					fs.rmdirSync(tmpDir, { recursive: true });
				}
				const configUrl = new URL(state.config.url);
				console.log(`configURL: ${configUrl.toString()} ${configUrl.hostname}`)
				await scrape({
					urls: [configUrl.toString()],
					maxRecursiveDepth: 1, // for html resources
					maxDepth: 3, // important to set otherwise badly coded sides with errors keep linking to broken SPA paths
					directory: tmpDir,
					// skip 3rd party websites
					urlFilter: (url: string) => {
						return url.includes(configUrl.hostname);
					},
					ignoreErrors: true, // in case some file cannot be downloaded, go through the others
					recursive: true,
				});

				let filesToCheck = glob.sync(path.join(tmpDir, `**/*.js`));
				filesToCheck = filesToCheck.concat(
					glob.sync(path.join(tmpDir, `**/*.html`))
				);

				// 40 hex chars enclosed by non word characters
				let addresses: string[] = [];
				for (const file of filesToCheck) {
					const content = fs.readFileSync(file, `utf8`);
					const regex = /\W(0x[a-fA-F0-9]{40})\W/g;
					const matches = (content.match(regex) || []);
					addresses.push(...matches.map(m => m.slice(1, -1)));
				}
				addresses = Array.from(new Set(addresses).values());

				return {
					...newState,
					info: `files downloaded to ${tmpDir}.\n${filesToCheck.join(`\n`)}\n${addresses.join(`\n`)}`,
				};
			} catch (error) {
				console.error(error);
				return {
					...newState,
					error: error.message,
					lastAction: `END`,
				};
			} finally {
				if (tmpDir) {
					fs.rmdirSync(tmpDir, { recursive: true });
				}
			}
		}
		case "END": {
			return { ...newState };
		}
		default:
			throw new Error(`Missing action "${nextAction}"`);
	}
}

function useAsyncReducer(red: typeof reducer, initState: TState) {
	const [state, setState] = useState(initState),
		next = async (/* action: TReducerAction<TActions> */) =>
			setState(await red(state /*, action */));
	return [state, next] as [TState, typeof next];
}

export const useAppState = (options: Partial<TCliOptions>) => {
	return useAsyncReducer(reducer, getDefaultState(options));
};
