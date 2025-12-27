import { json } from '@sveltejs/kit';
import {env} from '$env/dynamic/private';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
    const token = cookies.get('auth_token');
    if (!token) return json({ detail: 'Не авторизован' }, { status: 401 });

    try {
        const res = await fetch(`http://backend:8080/chat/sessions`, {
            headers: { 'Authorization': `Basic ${token}` }
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            return json(err, { status: res.status });
        }

        const data = await res.json();
        return json(data);
    } catch (err) {
        return json({ detail: 'Ошибка сервера' }, { status: 500 });
    }
}
export async function POST({ request, cookies }) {
    const token = cookies.get('auth_token');
    if (!token) return json({ detail: 'Не авторизован' }, { status: 401 });

    const body = await request.json();

    const payload = {
        title: body.title || `Новый чат ${new Date().toLocaleTimeString()}`,
        model_name: body.model_name || 'gpt-3.5-turbo',
        temperature: body.temperature ?? 0.7,
        max_tokens: body.max_tokens ?? 500,
        extra_params: body.extra_params || {},
        first_message: body.first_message || null
    };

    try {
        const res = await fetch(`http://backend:8080/chat/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        return json(data);
    } catch (err) {
        return json({ detail: 'Ошибка сервера' }, { status: 500 });
    }
}