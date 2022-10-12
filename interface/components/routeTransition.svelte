{#key $router.path}
	<div in:fade={{ duration: 200 }}>
		<slot />
	</div>
{/key}

<script>
	import { router } from "tinro"
	import { fade } from "svelte/transition"
</script>
