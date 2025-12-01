<script>
    export let size = 80;
</script>

<div class="fixed top-1/2 w-full h-full pointer-events-none z-50 overflow-hidden">
    <img src="/cats/cat_walk.gif"
         alt="Loading..."
         class="absolute top-1/2 transform -translate-y-1/2 animate-run-left"
         style="width:{size}px; height:{size}px;" />
</div>

<style>
    @keyframes run-left {
        0% {
            transform: translateX(100vw) translateY(-50%);
        }
        100% {
            transform: translateX(-100px) translateY(-50%);
        }
    }

    .animate-run-left {
        animation: run-left 3s linear infinite;
    }
</style>



