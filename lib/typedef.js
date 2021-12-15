/**
 * Settings structure
 * @typedef {Object} LibSettings
 *
 * @property {Object} version - Version
 * @property {String} version.tag - Authme version number
 * @property {String} version.build - Authme build number
 *
 * @property {Object} settings - Settings
 * @property {Boolean} settings.launch_on_startup - Launch On startup
 * @property {Boolean} settings.close_to_tray - Close app to tray
 * @property {Boolean} settings.code_description - Show 2FA names
 * @property {Boolean} settings.blur_codes - Reveal codes on hover
 * @property {Boolean} settings.reset_after_copy - Reset searchbar after copy
 * @property {Boolean} settings.search_history - Save search results
 * @property {Boolean} settings.disable_window_capture - Disable screen capture
 * @property {Boolean} settings.hardware_acceleration - Disable hardware acceleration
 * @property {Object} settings.search_filter - Filter search results
 * @property {Boolean} settings.search_filter.name - Filter for names
 * @property {Boolean} settings.search_filter.description - Filter for description
 * @property {Number} settings.default_display - Default display
 *
 * @property {Object} experimental - Experimental
 * @property {Null|Number} experimental.sort - Sort codes
 * @property {Boolean} experimental.screen_capture - Import screen capture
 *
 * @property {Object} security - Security
 * @property {Null|Boolean} security.require_password - Requires password
 * @property {Null|String} security.password - Password
 * @property {Null|String} security.key - Encryption key
 *
 * @property {Object} shortcuts - Shortcuts
 * @property {String} shortcuts.show - Show app
 * @property {String} shortcuts.settings- Show settings
 * @property {String} shortcuts.exit - Exit app
 * @property {String} shortcuts.zoom_reset - Reset zoom
 * @property {String} shortcuts.zoom_in - Zoom in
 * @property {String} shortcuts.zoom_out - Zoom out
 * @property {String} shortcuts.edit - Show edit
 * @property {String} shortcuts.import - Show import
 * @property {String} shortcuts.export - Show export
 * @property {String} shortcuts.release - Release notes
 * @property {String} shortcuts.support - Support Authme
 * @property {String} shortcuts.docs - Authme Docs
 * @property {String} shortcuts.licenses - Show licenses
 * @property {String} shortcuts.update - Update Authme
 * @property {String} shortcuts.info - About Authme
 *
 * @property {Object} global_shortcuts - Global Shortcuts
 * @property {String} global_shortcuts.show - Show app
 * @property {String} global_shortcuts.settings - Show settings
 * @property {String} global_shortcuts.exit - Exit app
 *
 * @property {Object} quick_shortcuts - Quick shortcuts
 *
 * @property {Object} search_history - Search history
 * @property {Null|String} search_history.latest - Exit app
 *
 * @property {Object} statistics - Statistics
 * @property {Null|Number} statistics.opens - Number of opens
 * @property {Null|Boolean} statistics.rated - Rated Authme
 * @property {Null|Boolean} statistics.feedback - Sent feedback
 */

/**
 * Storage structure
 * @typedef {Object} LibStorage
 * @property {Boolean} require_password - If password is required at start
 * @property {String} password - Saved password
 * @property {Boolean} new_encryption - New encryption mode
 * @property {String} key - Encryption key used to encrypt codes
 * @property {Undefined|String} backup_key - Backup key used to decrypt your password
 * @property {Undefined|String} backup_string -  Encrypted password with the backup key
 * @property {Undefined|String} hash - Backup key hash
 * @property {Array<String>} issuers - List of issuers
 */

/**
 * Authme import file structure
 * @typedef {Object} LibImportFile
 * @property {Array<String>} names - Names array
 * @property {Array<String>} secrets - Secrets array
 * @property {Array<String>} issuers - Issuers array
 * @property {Array<String>} types - Types array
 */

/**
 * .authme file structure
 * @typedef {Object} LibAuthmeFile
 * @property {String} role - Role of the file (codes, import, export, rollback, backup)
 * @property {Boolean} encrypted - Is the file encrypted
 * @property {String} codes - Base64 encoded string
 * @property {Date} date - Date when the file created
 * @property {Number} version - Indicates version (3)
 */
