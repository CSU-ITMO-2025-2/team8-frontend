<script>
    let jumping = false;

    function jump() {
        jumping = true;
        setTimeout(() => jumping=false, 2000);
    }
</script>

<div class="fixed bottom-8 left-8 z-40" onclick={() => jump()}>
    <img src="/cats/jump.png" alt="jumping cat" class="w-32 cursor-pointer transition-all" class:jumping={jumping} />
</div>

<style>
    @keyframes jump {
        0%,100%{transform:translateY(0);}
        20%{transform:translateY(-60px);}
        40%{transform:translateY(0);}
        60%{transform:translateY(-30px);}
    }
    .jumping { animation: jump 1.5s ease-out forwards; }
</style>
