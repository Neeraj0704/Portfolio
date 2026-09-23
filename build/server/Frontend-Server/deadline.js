export async function withDeadline(task, milliseconds) {
    const controller = new AbortController();
    let timer;
    const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => {
            const error = new Error("Request timed out");
            error.name = "TimeoutError";
            controller.abort(error);
            reject(error);
        }, milliseconds);
    });
    try {
        return await Promise.race([task(controller.signal), timeout]);
    }
    finally {
        clearTimeout(timer);
    }
}
