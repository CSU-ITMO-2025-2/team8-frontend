import { json } from '@sveltejs/kit';

function makeDebugId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

async function safeText(res) {
    try {
        return await res.text();
    } catch {
        return '';
    }
}

export async function GET({ cookies, fetch }) {
    const debugId = makeDebugId();
    const token = cookies.get('auth_token');

    if (!token) {
        console.log('[sessions][GET]', debugId, 'NO_COOKIE auth_token');
        return json(
            { debug: true, debugId, where: 'sveltekit', reason: 'NO_AUTH_TOKEN_COOKIE' },
            { status: 401 }
        );
    }

    try {
        const res = await fetch('http://backend/chat/sessions', {
            headers: { Authorization: `Basic ${token}` }
        });

        const text = await safeText(res);

        if (!res.ok) {
            console.log('[sessions][GET]', debugId, 'BACKEND_ERR', res.status, text.slice(0, 200));
            return json(
                {
                    debug: true,
                    debugId,
                    where: 'backend',
                    status: res.status,
                    body: text.slice(0, 300)
                },
                { status: res.status }
            );
        }

        let data;
        try { data = text ? JSON.parse(text) : {}; }
        catch { data = { raw: text }; }

        console.log('[sessions][GET]', debugId, 'OK');
        return json({ debug: true, debugId, where: 'ok', data });
    } catch (err) {
        console.log('[sessions][GET]', debugId, 'FETCH_ERROR', String(err));
        return json(
            { debug: true, debugId, where: 'fetch_error', error: String(err) },
            { status: 500 }
        );
    }
}

export async function POST({ request, cookies, fetch }) {
    const debugId = makeDebugId();
    const token = cookies.get('auth_token');

    if (!token) {
        console.log('[sessions][POST]', debugId, 'NO_COOKIE auth_token');
        return json(
            { debug: true, debugId, where: 'sveltekit', reason: 'NO_AUTH_TOKEN_COOKIE' },
            { status: 401 }
        );
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return json(
            { debug: true, debugId, where: 'sveltekit', reason: 'INVALID_JSON' },
            { status: 400 }
        );
    }

    const payload = {
        title: body.title || `Новый чат ${new Date().toLocaleTimeString()}`,
        model_name: body.model_name || 'gpt-3.5-turbo',
        temperature: body.temperature ?? 0.7,
        max_tokens: body.max_tokens ?? 500,
        extra_params: body.extra_params || {},
        first_message: body.first_message || null
    };

    try {
        const res = await fetch('http://backend/chat/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${token}`
            },
            body: JSON.stringify(payload)
        });

        const text = await safeText(res);

        if (!res.ok) {
            console.log('[sessions][POST]', debugId, 'BACKEND_ERR', res.status, text.slice(0, 200));
            return json(
                {
                    debug: true,
                    debugId,
                    where: 'backend',
                    status: res.status,
                    body: text.slice(0, 300)
                },
                { status: res.status }
            );
        }

        let data;
        try { data = text ? JSON.parse(text) : {}; }
        catch { data = { raw: text }; }

        console.log('[sessions][POST]', debugId, 'OK');
        return json({ debug: true, debugId, where: 'ok', data });
    } catch (err) {
        console.log('[sessions][POST]', debugId, 'FETCH_ERROR', String(err));
        return json(
            { debug: true, debugId, where: 'fetch_error', error: String(err) },
            { status: 500 }
        );
    }
}
