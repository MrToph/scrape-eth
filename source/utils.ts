export const sleep = (ms: number, shouldRejectWithMessage = ``) =>
	new Promise((resolve, reject) =>
		setTimeout(
			shouldRejectWithMessage
				? () => reject(new Error(shouldRejectWithMessage))
				: resolve,
			ms
		)
	);

export const removeAddresses = (addresses: string[]) => {
	const BLACKLIST = [
		`0x0000000000000000000000000000000000000000`,
		`0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`, // ETH mock
		`0x314159265dd8dbb310642f98f50c066173c1259b`, // ENS related
		`0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e`, // ENS related
	].map(bl => bl.toLowerCase());

	return addresses.filter((addr) => !BLACKLIST.includes(addr.toLowerCase()));
	// return addresses.filter((addr) => addr == `0xD533a949740bb3306d119CC777fa900bA034cd52`);
};
