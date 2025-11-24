<script>
    export let message = "Мяу! Нужна помощь?";
    let show = false;
</script>

<div class="fixed bottom-24 right-6 z-50">
    <img src="/cats/helper.png" class="w-32 drop-shadow-lg hover:scale-110 transition cursor-pointer" onclick={()=>show=!show}  alt=""/>

    {#if show}
        <div class="cat-bubble p-4 shadow-xl mt-2 bg-catcream text-catbrown rounded-xl">
            {message}
        </div>
    {/if}
</div>
