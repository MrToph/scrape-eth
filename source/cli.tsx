#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './ui';

const cli = meow(`
	Usage
	  $ scrape-eth

	Options
		--name  Your name

	Examples
	  $ scrape-eth --name=Jane
	  Hello, Jane
`, {
	flags: {
		url: {
			type: 'string'
		},
		chain: {
			type: 'string'
		}
	}
});

render(<App url={cli.flags.url} chain={cli.flags.url}/>);
