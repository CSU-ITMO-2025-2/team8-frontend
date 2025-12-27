import { json } from '@sveltejs/kit';

export async function GET({ cookies, fetch }) {
    const token = cookies.get('auth_token');
    if (!token) return json({ detail: 'Не авторизован' }, { status: 401 });

    const res = await fetch('http://backend/chat/sessions', {
        headers: { Authorization: `Basic ${token}` }
    });

    const text = await res.text();

    let data;
    try { data = text ? JSON.parse(text) : {}; }
    catch { data = { raw: text }; }

    return json(data, { status: res.status });
}