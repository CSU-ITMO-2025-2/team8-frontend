<script>
    import CatJump from '$lib/components/CatJump.svelte';
    import CatAssistant from '$lib/components/CatAssistant.svelte';
    import CatBackground from "$lib/components/CatBackground.svelte";
    import ChatBubble from "$lib/components/ChatBubble.svelte";

    let messages = $state([]);
    let input = $state('');

    async function send() {
        if (!input) return;
        messages = [...messages, { role: 'user', text: input }];

        input = '';
    }
</script>

<CatBackground/>
<CatJump />
<CatAssistant message="Мяу! Я помогу тебе с ответом :)" />

<div class="relative min-h-screen p-6 bg-catcream/30 backdrop-blur-sm">
    <div class="max-w-2xl mx-auto p-6 shadow-xl rounded-2xl space-y-4 bg-white/70 flex flex-col">

        {#each messages as m}
            <ChatBubble {m} />
        {/each}

        <div class="flex gap-2 mt-4">
            <input
                    bind:value={input}
                    placeholder="Скажи что-то коту..."
                    class="flex-1 p-3 rounded-xl bg-white shadow focus:outline-none focus:ring-2 focus:ring-catpink"
                    onkeydown={(e)=> e.key === 'Enter' && send()}
            />
            <button
                    class="bg-lime-600 hover:bg-pink-600 text-white px-4 py-3 rounded-xl transition transform hover:scale-105"
                    onclick={() => send()}>
                Отправить
            </button>
        </div>

    </div>
</div>
