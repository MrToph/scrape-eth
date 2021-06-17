#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./ui";
import { ValidChains } from "./state";

const cli = meow(
	`
	Usage
	  $ scrape-eth

	Options
		--url  	URL to scrape
		--chain	Optional chain to check contracts on. "eth" (default) or "bsc".

	Examples
	  $ scrape-eth --url yearn.finance
	  $ scrape-eth --url pancakeswap.finance --chain bsc
`,
	{
		flags: {
			url: {
				type: "string",
			},
			chain: {
				type: "string",
			},
		},
	}
);

const options = {
	debug: process.env["NODE_ENV"] === `development`,
};

render(
	<App url={cli.flags.url} chain={cli.flags.chain as ValidChains} />,
	options
);
