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
 * @property {Boolean} settings.show_2fa_names - Show 2FA names
 * @property {Boolean} settings.click_to_reveal - Reveal codes on hover
 * @property {Boolean} settings.reset_after_copy - Reset searchbar after copy
 * @property {Boolean} settings.save_search_results - Save search results
 * @property {Boolean} settings.disable_window_capture - Disable screen capture
 * @property {Boolean} settings.disable_hardware_acceleration - Disable hardware acceleration
 *
 * @property {Object} experimental - Experimental
 * @property {Null|Number} experimental.offset - Codes time offset
 * @property {Null|Number} experimental.sort - Sort codes
 * @property {Null|Number} experimental.webcam - Webcam
 *
 * @property {Object} security - Security
 * @property {Null|Boolean} security.require_password - Requires password
 * @property {Null|String} security.password - Password
 * @property {Null|Boolean} security.new_encryption - New encryption mode
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
 * @property {Boolean} require_password - Requires password
 * @property {String} password - Password
 * @property {Boolean} new_encryption - New encryption mode
 * @property {String} key - Encryption key
 * @property {Undefined|String} backup_key - Backup key
 * @property {Undefined|String} backup_string - Backup string
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
