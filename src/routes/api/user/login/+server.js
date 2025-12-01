import { json, redirect } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
    const { login, password } = await request.json();
    if (!login || !password) return json({ detail: 'Логин и пароль обязательны' }, { status: 400 });

    const token = btoa(`${login}:${password}`);

    // Проверка логина через API
    const res = await fetch('http://127.0.0.1:8080/chat/sessions?limit=1', {
        headers: { 'Authorization': `Basic ${token}` }
    });

    if (res.status === 200) {
        // сохраняем токен в HTTP-only cookie на 7 дней
        cookies.set('auth_token', token, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: false, // true если https
            maxAge: 60 * 60 * 24 * 7
        });
        return json({ success: true });
    } else {
        return json({ detail: 'Неверный логин или пароль' }, { status: 401 });
    }
}

