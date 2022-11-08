<div class="transparent-800 mx-auto w-full rounded-xl">
	<Disclosure let:open>
		<DisclosureButton class="transparentHover flex w-full items-center justify-between rounded-xl px-6 py-3 text-left text-2xl font-medium text-white outline-none duration-200 ease-linear focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500">
			<span>More options</span>
			<svg xmlns="http://www.w3.org/2000/svg" class={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
			</svg>
		</DisclosureButton>
		<Transition enter="transition duration-200 ease-out" enterFrom="transform scale-95 opacity-0" enterTo="transform scale-100 opacity-100" leave="transition duration-200 ease-out" leaveFrom="transform scale-100 opacity-100" leaveTo="transform scale-95 opacity-0">
			<DisclosurePanel class="px-4 pt-4 pb-2 text-left text-lg text-gray-200">
				<slot />
			</DisclosurePanel>
		</Transition>
	</Disclosure>
</div>

<script lang="ts">
	import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from "@rgossiaux/svelte-headlessui"
</script>
