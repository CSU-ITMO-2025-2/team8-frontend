import {env} from '$env/dynamic/private';

export async function GET({ params, cookies }) {
    const token = cookies.get('auth_token');
    if (!token) {
        return new Response('Unauthorized', { status: 401 });
    }

    const request_id  = params.sessionId ;

    const upstream = await fetch(
        `http://${env.API_ROUTE}:8080/chat/stream/${request_id }`,
        {
            headers: {
                'Authorization': `Basic ${token}`,
                'Accept': 'text/event-stream'
            }
        }
    );

    return new Response(upstream.body, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    });
}