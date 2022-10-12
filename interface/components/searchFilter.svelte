<Popover let:open>
	<PopoverButton>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
		</svg>
	</PopoverButton>
	<Transition enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
		<PopoverPanel class="absolute left-1/2 z-10 mt-1 w-52 -translate-x-1/2 transform">
			<div class="overflow-hidden rounded-xl text-xl font-medium text-black shadow-2xl">
				<div class="relative bg-white py-3">
					<div>
						<input type="checkbox" bind:checked={$settings.searchFilter.name} tabindex="-1" id="checkbox0" name="Search for names" class="checkbox" /> Name
					</div>
					<div>
						<input type="checkbox" bind:checked={$settings.searchFilter.description} tabindex="-1" id="checkbox1" name="Search for desciptions" class="checkbox" /> Desciption
					</div>
				</div>
			</div>
		</PopoverPanel>
	</Transition>
</Popover>

<script lang="ts">
	import { Popover, PopoverButton, PopoverPanel, Transition } from "@rgossiaux/svelte-headlessui"
	import { settings } from "../stores/settings"
</script>
