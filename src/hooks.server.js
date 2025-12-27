export async function handle({ event, resolve }) {
    console.log('[REQ]', event.request.method, event.url.pathname);
    return resolve(event);
}