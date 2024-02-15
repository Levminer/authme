<Popover let:open>
	<PopoverButton>
		<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
	</PopoverButton>
	<Transition enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
		<PopoverPanel class="absolute left-1/2 z-10 mt-1 w-52 -translate-x-1/2 transform">
			<div class="overflow-hidden rounded-xl text-xl font-medium text-black shadow-2xl">
				<div class="relative bg-white py-3">
					<div>
						<input type="checkbox" bind:checked={$settings.searchFilter.name} tabindex="-1" id="checkbox0" name="Search for names" class="checkbox" /> {language.common.name}
					</div>
					<div>
						<input type="checkbox" bind:checked={$settings.searchFilter.description} tabindex="-1" id="checkbox1" name="Search for desciptions" class="checkbox" /> {language.common.description}
					</div>
				</div>
			</div>
		</PopoverPanel>
	</Transition>
</Popover>

<script lang="ts">
	import { Popover, PopoverButton, PopoverPanel, Transition } from "@rgossiaux/svelte-headlessui"
	import { settings } from "../stores/settings"
	import { getLanguage } from "@utils/language"

	const language = getLanguage()
</script>
