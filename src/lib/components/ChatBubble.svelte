<script>
    export let m;
</script>

<div class="p-3 rounded-xl max-w-[75%]
            {m.role === 'user' ? 'bg-blue-300 self-start' : 'bg-pink-300 self-end'}">
    <p>{m.text}</p>
</div>