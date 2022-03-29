/**
 * Settings structure
 * @typedef {object} LibSettings
 *
 * @property {object} version - Version
 * @property {string} version.tag - Authme version number
 * @property {string} version.build - Authme build number
 *
 * @property {object} settings - Settings
 * @property {boolean} settings.launch_on_startup - Launch On startup
 * @property {boolean} settings.close_to_tray - Close app to tray
 * @property {boolean} settings.codes_description - Show 2FA names
 * @property {boolean} settings.blur_codes - Reveal codes on hover
 * @property {boolean} settings.reset_after_copy - Reset searchbar after copy
 * @property {boolean} settings.search_history - Save search results
 * @property {boolean} settings.disable_window_capture - Disable screen capture
 * @property {boolean} settings.hardware_acceleration - Disable hardware acceleration
 * @property {object} settings.search_filter - Filter search results
 * @property {boolean} settings.search_filter.name - Filter for names
 * @property {boolean} settings.search_filter.description - Filter for description
 * @property {null|string} settings.language - Change language
 * @property {null|string} settings.sort - Sort codes
 *
 * @property {object} experimental - Experimental
 * @property {boolean} experimental.screen_capture - Import screen capture
 *
 * @property {object} security - Security
 * @property {null|boolean} security.require_password - Requires password
 * @property {null|string} security.password - Password
 * @property {null|string} security.key - Encryption key
 *
 * @property {object} shortcuts - Shortcuts
 * @property {string} shortcuts.show - Show app
 * @property {string} shortcuts.settings- Show settings
 * @property {string} shortcuts.exit - Exit app
 * @property {string} shortcuts.zoom_reset - Reset zoom
 * @property {string} shortcuts.zoom_in - Zoom in
 * @property {string} shortcuts.zoom_out - Zoom out
 * @property {string} shortcuts.edit - Show edit
 * @property {string} shortcuts.import - Show import
 * @property {string} shortcuts.export - Show export
 * @property {string} shortcuts.release - Release notes
 * @property {string} shortcuts.support - Support Authme
 * @property {string} shortcuts.docs - Authme Docs
 * @property {string} shortcuts.licenses - Show licenses
 * @property {string} shortcuts.update - Update Authme
 * @property {string} shortcuts.info - About Authme
 *
 * @property {object} global_shortcuts - Global Shortcuts
 * @property {string} global_shortcuts.show - Show app
 * @property {string} global_shortcuts.settings - Show settings
 * @property {string} global_shortcuts.exit - Exit app
 *
 * @property {object} quick_shortcuts - Quick shortcuts
 *
 * @property {object} search_history - Search history
 * @property {null|string} search_history.latest - Exit app
 *
 * @property {object} statistics - Statistics
 * @property {null|number} statistics.opens - Number of opens
 * @property {null|boolean} statistics.rated - Rated Authme
 * @property {null|boolean} statistics.feedback - Sent feedback
 *
 * @property {import("electron").Rectangle} window - Windows bounds
 */

/**
 * Storage structure
 * @typedef {object} LibStorage
 * @property {boolean} require_password - If password is required at start
 * @property {string} password - Saved password
 * @property {string} key - Encryption key used to encrypt codes
 * @property {string[]} issuers - List of issuers
 * @property {string} settings_page - Current settings page
 */

/**
 * Authme import file structure
 * @typedef {object} LibImportFile
 * @property {string[]} names - Names array
 * @property {string[]} secrets - Secrets array
 * @property {string[]} issuers - Issuers array
 * @property {string[]} types - Types array
 */

/**
 * .authme file structure
 * @typedef {object} LibAuthmeFile
 * @property {string} role - Role of the file (codes, import, export, rollback, backup)
 * @property {boolean} encrypted - Is the file encrypted
 * @property {string} codes - Base64 encoded string
 * @property {Date} date - Date when the file created
 * @property {number} version - Indicates version (3)
 */

/**
 * .authmebackup file structure
 * @typedef {object} LibAuthmeBackupFile
 * @property {string} codes - Base64 encoded string
 * @property {string} hash - Hashed backup key
 * @property {string|null} key - Encryption key
 * @property {string|null} password - Used password
 * @property {Date} date - Date when the file created
 * @property {number} version - Indicates version (1)
 */
