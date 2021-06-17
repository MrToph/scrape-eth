import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";
import retry from "async-retry";
import pMap from "p-map";

export type TContractData = {
	address: string;
	url: string;
	error?: string;
	isContract?: boolean;
	contractName?: string;
	tokenTracker?: string;
};
type ValidChains = "eth" | "bsc";

// polyfill for https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
// export const PromiseAllSettled = async <T>(promises: Promise<T>[]) => {
// 	return Promise.all(
// 		promises.map((p) =>
// 			p.then(
// 				(v) => {
// 					return { status: "fulfilled", value: v as T };
// 				},
// 				(error) => {
// 					return { status: "rejected", reason: error };
// 				}
// 			)
// 		)
// 	);
// };

// export const PromiseAllSettledFilterFulfilled = async <T>(
// 	promises: Promise<T>[]
// ) => {
// 	const results = await PromiseAllSettled(promises);
// 	return results
// 		.filter((r) => r.status === `fulfilled`)
// 		.map((r) => (r as { status: "fulfilled"; value: T }).value);
// };

const makeUrl = (chain: ValidChains, path: string) => {
	const prefix =
		chain === `eth`
			? `https://etherscan.io`
			: chain === `bsc`
			? `https://bscscan.com`
			: ``;
	if (!prefix) throw new Error(`Unknwon chainId ${chain}`);

	return `${prefix}${path}`;
};

const checkRateLimited = ($html: typeof cheerio) => {
	// these are two different errors / html pages
	return (
		/our servers are currently busy/gi.test($html.text()) ||
		/Request Throttled/gi.test($html.text())
	);
};

const fetchContractData = async (
	addr: string,
	chain: ValidChains
): Promise<TContractData> => {
	const res = await axios.get(makeUrl(chain, `/address/${addr}#code`));
	const $ = cheerio.load(res.data);
	if (checkRateLimited($)) throw new Error(`Rate limited`);

	const isContract = $(`#ContentPlaceHolder1_trContract`).length > 0;

	let contractName = ``;
	let tokenTracker = ``;
	if (isContract) {
		tokenTracker = $(`#ContentPlaceHolder1_tr_tokeninfo a`).text();
		contractName = $(`#ContentPlaceHolder1_contractCodeDiv span.h6`)
			.first()
			.text();
	}

	return {
		address: addr,
		url: makeUrl(chain, `/address/${addr}${isContract ? `#code` : ``}`),
		isContract: isContract,
		contractName: contractName,
		tokenTracker: tokenTracker,
	};
};

export const fetchContractsData = async (
	addresses: string[],
	chain: ValidChains
): Promise<TContractData[]> => {
	return pMap(
		addresses,
		(addr) =>
			retry(async (bail: any) => fetchContractData(addr, chain), {
				retries: 10,
			}).catch((error: any) => {
				return {
					address: addr,
					url: makeUrl(chain, `/address/${addr}`),
					error: error.message,
				};
			}),
		{ concurrency: 5 }
	);
};
