import { json } from '@sveltejs/kit';
import {API_ROUTE} from "$env/static/private";
/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const body = await request.json();
    const { login, password } = body;

    try {
        const res = await fetch(`http://${API_ROUTE}:8080/user/registration`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, password })
        });

        if (res.status === 200) {
            const data = await res.json();
            return json(data);
        } else {
            const error = await res.json().catch(()=>({ detail: 'Ошибка регистрации' }));
            return json(error, { status: res.status });
        }
    } catch (err) {
        return json({ detail: 'Серверная ошибка' }, { status: 500 });
    }
}
