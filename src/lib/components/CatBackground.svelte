<script>
    import { fly } from "svelte/transition";

    const cats = Array.from({ length: 12 }).map(() => ({
        top: Math.random() * 95 + "%",
        left: Math.random() * 95 + "%",
        size: Math.random() * 95 + 40
    }));
</script>

<div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    {#each cats as c}
        <img
                src="/cats/cat{Math.floor(Math.random()*5)+1}.png"
                alt="cat"
                class="absolute opacity-30 hover:opacity-60 transition"
                style="top:{c.top}; left:{c.left}; width:{c.size}px;"
                transition:fly={{ x: 200, duration: 3000 }}
        />
    {/each}
</div>
