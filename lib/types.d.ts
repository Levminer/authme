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
