import { json } from '@sveltejs/kit';
import {env} from '$env/dynamic/private';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, cookies }) {
    const token = cookies.get('auth_token');
    if (!token) return json({ detail: 'Не авторизован' }, { status: 401 });

    try {
        const res = await fetch(`http://backend/chat/sessions/${params.sessionId}`, {
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
