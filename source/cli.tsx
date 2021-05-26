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
		--name  Your name

	Examples
	  $ scrape-eth --name=Jane
	  Hello, Jane
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
	<App url={cli.flags.url} chain={cli.flags.url as ValidChains} />,
	options
);
