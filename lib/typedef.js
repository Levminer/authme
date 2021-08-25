/**
 * Settings structure
 * @typedef {object} libSettings
 *
 * @property {object} version - Version
 * @property {string} version.tag - Authme version number
 * @property {string} version.build - Authme build number
 *
 * @property {object} settings - Settings
 * @property {boolean} settings.launch_on_startup - Launh On startup
 * @property {boolean} settings.close_to_tray - Close app to tray
 * @property {boolean} settings.show_2fa_names - Show 2FA names
 * @property {boolean} settings.click_to_reveal - Reveal codes on hover
 * @property {boolean} settings.reset_after_copy - Reset searchbar after copy
 * @property {boolean} settings.save_search_results - Save search results
 * @property {boolean} settings.disable_window_capture - Disable screen capture
 * @property {boolean} settings.disable_hardware_acceleration - Disable hardware acceleration
 *
 * @property {object} experimental - Experimental
 * @property {null|number} experimental.offset - Codes time offset
 * @property {null|number} experimental.sort - Sort codes
 *
 * @property {object} security - Security
 * @property {null|boolean} security.require_password - Requires password
 * @property {null|string} security.password - Password
 * @property {null|boolean} security.new_encryption - New encryption mode
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
 * @property {object} search_history - Search history
 * @property {null|string} search_history.latest - Exit app
 *
 * @property {object} statstics - Statistics
 * @property {null|number} statstics.opens - Number of opens
 * @property {null|boolean} statstics.rated - Rated Authme
 * @property {null|boolean} statstics.feedback - Sent feedback
 */

/**
 * Storage structure
 * @typedef {Object} libStorage
 * @property {boolean} require_password - Requires password
 * @property {string} password - Password
 * @property {boolean} new_encryption - New encryption mode
 * @property {string} key - Encryption key
 * @property {undefined|string} backup_key - Backup key
 * @property {undefined|string} backup_string - Backup string
 * @property {undefined|string} hash - Backup key hash
 */
