import { json } from '@sveltejs/kit';
import {API_ROUTE} from '$env/static/private';
/** @type {import('./$types').RequestHandler} */
export async function POST({ params, request, cookies }) {
    const token = cookies.get('auth_token');
    if (!token) return json({ detail: 'Не авторизован' }, { status: 401 });

    const body = await request.json();

    const payload = {
        content: body.content,
        role: 'user',
        meta: body.meta || {}
    };

    try {
        const res = await fetch(`${API_ROUTE}:8080/chat/sessions/${params.sessionId}/messages`, {
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
