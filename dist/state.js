"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppState = void 0;
const react_1 = require("react");
const website_scraper_1 = __importDefault(require("website-scraper"));
const url_1 = require("url");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const glob_1 = __importDefault(require("glob"));
const utils_1 = require("./utils");
const getNextAction = (action) => {
    const ordered = [`INIT`, `SCRAPE`, `END`];
    const currentIndex = ordered.findIndex((s) => s === action);
    if (currentIndex < 0)
        throw new Error(`Invalid action "${action}"`);
    if (currentIndex === ordered.length - 1)
        throw new Error(`Last action repeatedly called`);
    return ordered[currentIndex + 1];
};
const getDefaultState = (options) => ({
    lastAction: `INIT`,
    error: ``,
    info: `Scraping ${options.url} ...`,
    config: {
        // url: options.url || `https://yearn.finance/vaults`,
        url: options.url || `https://bdo.money`,
        chain: options.chain || `eth`,
    },
});
async function reducer(state
// action: TReducerAction<TActions>
) {
    const nextAction = getNextAction(state.lastAction);
    const newState = {
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
            }
            else if (![`eth`, `bsc`].includes(state.config.chain)) {
                return {
                    ...newState,
                    error: `Missing/invalid --chain parameter`,
                    lastAction: `END`,
                };
            }
            await utils_1.sleep(5000);
            let tmpDir = ``;
            try {
                tmpDir = await path_1.default.join(os_1.default.tmpdir(), "scrape-eth");
                if (fs_1.default.existsSync(tmpDir)) {
                    fs_1.default.rmdirSync(tmpDir, { recursive: true });
                }
                const configUrl = new url_1.URL(state.config.url);
                console.log(`configURL: ${configUrl.toString()} ${configUrl.hostname}`);
                await website_scraper_1.default({
                    urls: [configUrl.toString()],
                    maxRecursiveDepth: 1,
                    maxDepth: 3,
                    directory: tmpDir,
                    // skip 3rd party websites
                    urlFilter: (url) => {
                        return url.includes(configUrl.hostname);
                    },
                    ignoreErrors: true,
                    recursive: true,
                });
                let filesToCheck = glob_1.default.sync(path_1.default.join(tmpDir, `**/*.js`));
                filesToCheck = filesToCheck.concat(glob_1.default.sync(path_1.default.join(tmpDir, `**/*.html`)));
                // 40 hex chars enclosed by non word characters
                let addresses = [];
                for (const file of filesToCheck) {
                    const content = fs_1.default.readFileSync(file, `utf8`);
                    const regex = /\W(0x[a-fA-F0-9]{40})\W/g;
                    const matches = (content.match(regex) || []);
                    addresses.push(...matches.map(m => m.slice(1, -1)));
                }
                addresses = Array.from(new Set(addresses).values());
                return {
                    ...newState,
                    info: `files downloaded to ${tmpDir}.\n${filesToCheck.join(`\n`)}\n${addresses.join(`\n`)}`,
                };
            }
            catch (error) {
                console.error(error);
                return {
                    ...newState,
                    error: error.message,
                    lastAction: `END`,
                };
            }
            finally {
                if (tmpDir) {
                    fs_1.default.rmdirSync(tmpDir, { recursive: true });
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
function useAsyncReducer(red, initState) {
    const [state, setState] = react_1.useState(initState), next = async ( /* action: TReducerAction<TActions> */) => setState(await red(state /*, action */));
    return [state, next];
}
const useAppState = (options) => {
    return useAsyncReducer(reducer, getDefaultState(options));
};
exports.useAppState = useAppState;
