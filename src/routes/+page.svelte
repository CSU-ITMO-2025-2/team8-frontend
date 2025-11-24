<script>
    import CatBackground from '$lib/components/CatBackground.svelte';
</script>

<CatBackground />

<div class="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
    <h1 class="text-5xl md:text-6xl font-bold text-black drop-shadow-lg mb-6">
        CatLLM — чат, где коты помогают тебе думать
    </h1>

    <p class="text-xl text-black/80 mb-10 max-w-2xl">
        Общайся с нашим милым котом-ассистентом и получай ответы на любые вопросы.
    </p>

    <a href="/chat"
       class="bg-pink-300 hover:bg-pink-600 text-white py-3 px-6 rounded-2xl text-lg shadow-lg transition transform hover:scale-105">
        Начать чат
    </a>
</div>
