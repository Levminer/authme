/* Authme Import file structure  */
interface LibImportFile {
	names: string[]
	secrets: string[]
	issuers: string[]
	types?: string[]
}

interface LibAuthmeFile {
	role: "codes" | "import" | "export"
	encrypted: boolean
	codes: string
	date: string
	version: 3
}

interface LibStorage {
	require_password: boolean
	password: string
	key: string
	issuers: string[]
	settings_page: string
	apiKey: string
}

interface LibWindow extends Electron.Rectangle {
	maximized?: boolean
}

interface LibSettings {
	info: {
		version: string
		build: string
		date: string
	}

	settings: {
		launch_on_startup: boolean
		close_to_tray: boolean
		codes_description: boolean
		reset_after_copy: boolean
		search_history: boolean
		hardware_acceleration: boolean
		analytics: boolean
		language: null | string
		sort: null | number
		search_filter: {
			name: boolean
			description: boolean
		}
	}

	security: {
		require_password: null | boolean
		password: null | string
		key: null | string
	}

	statistics: {
		opens: number
		rated: null | boolean
		feedback: null | boolean
	}

	search_history: {
		latest: null | string
	}

	global_shortcuts: {
		show: string
		settings: string
		exit: string
	}

	shortcuts: {
		show: string
		settings: string
		exit: string
		zoom_reset: string
		zoom_in: string
		zoom_out: string
		edit: string
		import: string
		export: string
		release: string
		support: string
		docs: string
		licenses: string
		update: string
		info: string
	}

	window: LibWindow

	experimental?: {}
}

/** Query selector element types */
interface Element {
	/** Element styles */
	style: CSSStyleDeclaration

	/**Is element disabled */
	disabled: boolean

	/**Input element value */
	value: string

	/**Is checkbox element checked */
	checked: boolean
}

/** HTML dialog element types */
interface LibDialogElement extends Element {
	/** Show the dialog as a modal */
	showModal: Function

	/* Close the modal */
	close: Function
}
