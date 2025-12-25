<script>
    export let m;
</script>

<div class="w-full flex {m.role === 'user' ? 'justify-end' : 'justify-start'}">
    <div
            class="
      max-w-[75%] p-3 rounded-2xl text-base leading-relaxed shadow-sm whitespace-pre-wrap
      {m.role === 'user'
        ? 'bg-lime-600 text-white rounded-br-none'
        : 'bg-pink-300 text-gray-800  rounded-bl-none'}">
        {m.content}
    </div>
</div>