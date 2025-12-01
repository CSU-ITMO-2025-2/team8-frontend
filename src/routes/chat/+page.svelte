<script>
    import { onMount } from 'svelte';
    import CatBackground from '$lib/components/CatBackground.svelte';
    import CatJump from '$lib/components/CatJump.svelte';
    import CatAssistant from '$lib/components/CatAssistant.svelte';
    import ChatBubble from '$lib/components/ChatBubble.svelte';
    import LoaderGif from "$lib/components/LoaderGif.svelte";

    let chats = [];
    let currentChat = null;
    let messages = [];
    let input = '';
    let loading = false;

    async function fetchChats() {
        const res = await fetch('/api/chat/sessions');
        if (res.ok) {
            chats = await res.json();
            if (chats.length && !currentChat) selectChat(chats[0].id);
        } else {
            chats = [];
        }
    }

    async function createChat() {
        const res = await fetch('/api/chat/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: `Новый чат ${new Date().toLocaleTimeString()}` })
        });
        if (res.ok) {
            const newChat = await res.json();
            chats = [newChat, ...chats];
            selectChat(newChat.id);
        }
    }

    async function selectChat(chatId) {
        messages = []
        loading = true;
        const res = await fetch(`/api/chat/${chatId}`);
        if (res.ok) {
            currentChat = await res.json();
            messages = currentChat.messages;
        } else {
            currentChat = null;
            messages = [];
        }
        loading = false;
    }

    async function sendMessage() {
        if (!input || !currentChat) return;

        const text = input;
        input = '';
        messages = [...messages, { role: 'user', content: text }];

        const res = await fetch(`/api/chat/${currentChat.id}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: text })
        });

        if (res.ok) {
            // const answer = await res.json();
            // messages = [...messages, answer];
        }
    }

    onMount(() => {
        fetchChats();
    });
</script>

<CatBackground/>
<CatJump/>
<CatAssistant message="Мяу! Я помогу тебе с ответом :)" />

{#if loading}
    <LoaderGif size={500} />
{/if}

<div class="flex min-h-screen p-4 gap-4">
    <div class="w-1/12 bg-white/80 p-4 rounded-2xl shadow space-y-4">
        <button class="w-full py-2 bg-green-400 text-white rounded-xl hover:bg-green-500 transition"
                on:click={createChat}>
            + Новый чат
        </button>

        {#each chats as chat}
            <div
                    class="p-2 cursor-pointer rounded-xl hover:bg-green-200 transition {chat.id === currentChat?.id ? 'bg-green-300' : ''}"
                    on:click={() => selectChat(chat.id)}>
                {chat.title || `Чат ${chat.id}`}
            </div>
        {/each}
    </div>

    <div class="flex-1 flex flex-col bg-white/70 p-4 rounded-2xl shadow">
        {#if currentChat}
            <div class="flex-1 overflow-y-auto space-y-2">
                {#each messages as m}
                    <ChatBubble {m}/>
                {/each}
            </div>

            <div class="mt-4 flex gap-2">
                <input bind:value={input}
                       placeholder="Скажи что-то коту..."
                       class="flex-1 p-3 rounded-xl bg-white shadow focus:outline-none focus:ring-2 focus:accent-green-100"
                       on:keydown={(e)=> e.key === 'Enter' && sendMessage()} />
                <button class="bg-lime-600 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition transform hover:scale-105"
                        on:click={sendMessage}>
                    Отправить
                </button>
            </div>
        {:else}
            <div class="flex-1 flex items-center justify-center text-gray-400">
                Выберите чат или создайте новый
            </div>
        {/if}
    </div>
</div>
