<script>
    import { onMount } from 'svelte';
    import CatBackground from '$lib/components/CatBackground.svelte';
    import CatJump from '$lib/components/CatJump.svelte';
    import CatAssistant from '$lib/components/CatAssistant.svelte';
    import ChatBubble from '$lib/components/ChatBubble.svelte';
    import LoaderGif from "$lib/components/LoaderGif.svelte";

    let chats = $state([]);
    let currentChat = $state(null);
    let messages = $state([]);
    let input = $state('');
    let loading = $state(false);

    async function fetchChats() {
        const res = await fetch('/api/chat/sessions', { credentials: 'include' });
        if (res.ok) {
            chats = await res.json();
            if (chats.length && !currentChat) selectChat(chats[0].id);
        } else {
            chats = [];
        }
    }
    function chatTitle() {
        const d = new Date();
        const pad = (n) => String(n).padStart(2, '0');

        return `Чат-${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}-${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    async function createChat() {
        const res = await fetch('/api/chat/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: chatTitle() })
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
        if (!res.ok) return;

        const msg = JSON.parse(await res.text());
        const requestId = msg?.meta?.request_id;
        if (!requestId) return;

        // пустое сообщение ассистента (ОДИН РАЗ)
        messages = [...messages, { role: 'assistant', content: '' }];
        const aiIndex = messages.length - 1;

        // SSE
        const sse = await fetch(
            `/api/chat/${requestId}/stream`,
            { headers: { 'Accept': 'text/event-stream' } }
        );
        if (!sse.body) return;

        const reader = sse.body
            .pipeThrough(new TextDecoderStream())
            .getReader();

        let buffer = '';

        while (true) {

            const { value, done } = await reader.read();
            console.log(value)
            console.log(done)
            if (done) break;

            buffer += value;
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                const l = line.trim();
                if (!(l.startsWith('data=') || l.startsWith('data:'))) continue;

                let raw = l.slice(5).trim();              // после data=
                raw = raw.replace(/^"+|"+$/g, '');        // убрать внешние "
                raw = raw.replace(/\\n/g, '\n');          // переносы
                raw = raw.replace(/'/g, '"');             // python dict → json

                let payload;
                try { payload = JSON.parse(raw); }
                catch { continue; }

                if (payload.type === 'chunk' && payload.delta) {
                    messages[aiIndex].content += payload.delta;
                    messages = [...messages];
                }

                if (payload.type === 'final' && payload.content) {
                    messages[aiIndex].content = payload.content
                }

                if (payload.type === 'done') return;
            }
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

<div class="flex h-screen p-4 gap-4">
    <aside class="w-72 md:w-80 shrink-0 bg-white/80 p-3 rounded-2xl shadow flex flex-col">
        <button
                class="w-full py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
                on:click={createChat}
        >
            + Новый чат
        </button>

        <div class="mt-3 flex-1 overflow-y-auto space-y-2 pr-1">
            {#each chats as chat}
                <button
                        class="
            w-full text-left p-2 rounded-xl transition
            hover:bg-green-100
            {chat.id === currentChat?.id ? 'bg-green-200 ring-1 ring-green-300' : 'bg-white/60'}
          "
                        on:click={() => selectChat(chat.id)}
                >
                    <div class="flex items-center gap-2">
                        <span class="h-2 w-2 rounded-full {chat.id === currentChat?.id ? 'bg-green-600' : 'bg-green-300'}"></span>
                        <span class="truncate font-medium">
              {chat.title || `Чат ${chat.id}`}
            </span>
                    </div>

                    <div class="mt-0.5 text-xs text-gray-500 truncate">
                        {chat.last_message?.content || '—'}
                    </div>
                </button>
            {/each}
        </div>
    </aside>

    <!-- Chat -->
    <section class="flex-1 min-w-0 flex flex-col bg-white/70 p-4 rounded-2xl shadow">
        {#if currentChat}
            <div class="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
                {#each messages as m}
                    <ChatBubble {m} />
                {/each}
            </div>

            <div class="mt-3 flex gap-2">
                <input
                        bind:value={input}
                        placeholder="Скажи что-то коту..."
                        class="flex-1 min-w-0 p-3 rounded-xl bg-white shadow focus:outline-none focus:ring-2 focus:ring-green-300"
                        on:keydown={(e)=> e.key === 'Enter' && sendMessage()}
                />
                <button
                        class="shrink-0 bg-lime-600 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition transform hover:scale-105"
                        on:click={sendMessage}
                >
                    Отправить
                </button>
            </div>
        {:else}
            <div class="flex-1 flex items-center justify-center text-gray-400">
                Выберите чат или создайте новый
            </div>
        {/if}
    </section>
</div>
