import { json } from '@sveltejs/kit';

export async function GET({ cookies, fetch,request,url}) {
    const token = cookies.get('auth_token');
    if (!token) {
        return json({
            debug: true,
            where: 'sveltekit',
            reason: 'NO_COOKIE',
            host: request.headers.get('host'),
            proto: request.headers.get('x-forwarded-proto'),
            path: url.pathname,
            cookieHeaderPresent: Boolean(request.headers.get('cookie'))
        }, { status: 401 });
    }

    const res = await fetch('http://backend/chat/sessions', {
        headers: { Authorization: `Basic ${token}` }
    });

    const text = await res.text();

    let data;
    try { data = text ? JSON.parse(text) : {}; }
    catch { data = { raw: text }; }

    return json(data, { status: res.status });
}