export const sleep = (ms: number, shouldRejectWithMessage = ``) =>
  new Promise((resolve, reject) =>
    setTimeout(
      shouldRejectWithMessage
        ? () => reject(new Error(shouldRejectWithMessage))
        : resolve,
      ms
    )
  );
