/* eslint-disable no-unused-vars */
/// <reference types="svelte" />

declare global {
	/* Authme Import file structure  */
	interface LibImportFile {
		names: string[]
		secrets: string[]
		issuers: string[]
		types?: string[]
	}

	/** Authme JSON import file options */
	interface LibAuthmeFile {
		role: "codes" | "import" | "export"
		encrypted: boolean
		codes: string
		date: string
		version: 3
	}

	/** 2FA codes format */
	interface LibCodesFormat {
		name: string
		secret: string
		issuer: string
		type?: string
	}

	interface LibState {
		authenticated: boolean
		importData: null | string
		updateAvailable: boolean
		searchHistory: string
	}

	interface LibSearchQuery {
		name: string
		description: string
	}

	interface LibSettings {
		info: {
			version: string
			build: string
			date: string
		}

		security: {
			requireAuthentication: null | boolean
			hardwareAuthentication: boolean
			password: null | string
			hardwareKey: null | string
		}

		settings: {
			launchOnStartup: boolean
			minimizeToTray: boolean
			optionalAnalytics: boolean
			codesDescription: boolean
			blurCodes: boolean
			sortCodes: number
			codesLayout: number
		}

		searchFilter: {
			name: boolean
			description: boolean
		}

		vault: {
			codes: null | string
		}

		shortcuts: {
			show: string
			settings: string
			exit: string
		}
	}

	/** Query selector element types */
	interface Element {
		/** Element styles */
		style: CSSStyleDeclaration

		/* value */
		value: string
	}

	/** HTML dialog element types */
	interface LibDialogElement extends Element {
		/** Show the dialog as a modal */
		showModal: Function

		/* Close the modal */
		close: Function

		/** Property if dialog open */
		open: boolean
	}
}

export {}
