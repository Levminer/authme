<script lang="ts">
	import { FileInput, KeyRound, Settings } from "lucide-svelte"
</script>

<div
	class="fixed bottom-0 left-1/2 z-50 h-16 w-full max-w-full -translate-x-1/2 rounded-none border border-gray-600 bg-gray-700 duration-200 ease-in-out md:bottom-4 md:max-w-lg md:rounded-full"
>
	<div class="no-scrollbar mx-auto flex h-full max-w-lg flex-1 overflow-x-auto">
		<a
			aria-label="Codes"
			href="/codes"
			class="group inline-flex flex-shrink-0 flex-grow flex-col items-center justify-center sm:rounded-s-full px-5 text-gray-200 duration-200 ease-in-out hover:bg-gray-800 hover:text-white rounded-none"
		>
			<KeyRound />
		</a>
		<a
			aria-label="Import"
			href="/import"
			class="group inline-flex flex-shrink-0 flex-grow flex-col items-center justify-center px-5 text-gray-200 duration-200 ease-in-out hover:bg-gray-800 hover:text-white"
		>
			<FileInput />
		</a>

		<a
			aria-label="Settings"
			href="/settings"
			class="group inline-flex flex-shrink-0 flex-grow flex-col items-center justify-center sm:rounded-e-full px-5 text-gray-200 duration-200 ease-in-out hover:bg-gray-800 hover:text-white rounded-none"
		>
			<Settings />
		</a>
	</div>
</div>
