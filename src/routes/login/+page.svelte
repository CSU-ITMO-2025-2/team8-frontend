<script>
    import { setAuth } from '$lib/stores/auth';
    let login = '';
    let password = '';
    let error = '';

    async function loginUser() {
        error = '';

        const res = await fetch('/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, password })
        });

        if (res.status === 200) {
            const data = await res.json();
            setAuth(login, password); // сохраняем login и password в store
            window.location.href = "/chat";
        } else {
            const body = await res.json().catch(()=>({}));
            error = body.detail || 'Ошибка входа';
        }
    }
</script>

<div class="max-w-md mx-auto p-6 shadow-xl bg-white rounded-2xl mt-20 space-y-4">
    <h1 class="text-3xl font-bold text-center">Вход</h1>

    {#if error}
        <div class="p-3 text-red-600 bg-red-100 rounded-xl">{error}</div>
    {/if}

    <input bind:value={login} placeholder="Логин" class="p-3 w-full rounded-xl bg-gray-100"/>
    <input bind:value={password} type="password" placeholder="Пароль" class="p-3 w-full rounded-xl bg-gray-100"/>

    <button on:click={loginUser} class="w-full bg-pink-500 text-white py-3 rounded-xl">
        Войти
    </button>

    <a href="/register" class="block text-center text-pink-600">Регистрация</a>
</div>
