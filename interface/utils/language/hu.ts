import { localeEN } from "@utils/language/en"

export const localeHU: typeof localeEN = {
	common: {
		confirm: "Megerősítés",
		continue: "Folytatás",
		cancel: "Mégse",
		close: "Bezárás",
		copy: "Másolás",
		copied: "Másolva",
		moreOptions: "Több opció",
		name: "Név",
		description: "Leírás",
		edit: "Módosítás",
		delete: "Törlés",
	},

	menu: {
		codes: "Kódok",
		import: "Importálás",
		export: "Exportálás",
		edit: "Módosítás",
		settings: "Beállítások",
		show: "Authme Megjelenítése",
		exit: "Authme Bezárása",
	},

	landing: {
		welcome: "Üdvözöllek!",
		gettingStarted: "Kezdés",
		gettingStartedText: "Válaszd ki, hogyan szeretnéd használni az Authme-t.",
		passwordAuth: "Hitelesítés jelszóval",
		passwordAuthText: "Minden indításkor meg kell adnod a jelszavadat.",
		noAuth: "Nincs hitelesítés",
		noAuthText: "Ha nem szeretnél jelszót megadni minden indításkor.",
		hardwareAuth: "Hardveres hitelesítés",
		hardwareAuthText: "Fontos műveletek megerősítése Windows Hello-val, Touch ID-val vagy bármilyen WebAuthn kompatibilis hardverkulccsal.",
		createPass: "Jelszó létrehozása",
		createPassText: "Hozz létre egy erős jelzót a kódjaid titkosításához.",
		password: "Jelszó",
		confirmPassword: "Jelszó megerősítése",
		chooseDifferent: "Válassz másik hitelesítést",
		chooseDifferentText: "Visszalépés az előző oldalra és válassz másik hitelesítési módot.",
		goBack: "Vissza",
		dialog: {
			passwordMaxLength: "A jelszó maximum 64 karakter hosszú lehet.",
			passwordMinLength: "A jelszónak minimum 8 karakterből kell állnia.",
			passwordsNotMatch: "A jelszók nem egyeznek.",
			commonPassword: "Túl gyakori jelszó.",
		},
	},

	confirm: {
		welcomeBack: "Üdvözöllek újra!",
		confirmPassword: "Jelszó megerősítése",
		confirmPasswordText: "Kérlek add meg a jelszavadat a folytatáshoz.",
		password: "Jelszó",
		forgotPassword: "Elfelejtetted a jelszavad?",
		forgotPasswordText: "A kódjaidat a jelszavad védi. Ha elfelejtetted a jelszavad, nem tudsz hozzáférni a kódjaidhoz.",
		dialog: {
			wrongPassword: "Rossz jelszó!",
		},
	},

	codes: {
		importCodes: "Importáld be a 2FA kódjaidat",
		importCodesText: "Importáld be a már meglévő 2FA kódjaidat, vagy válaszd ki az Authme import fájlodat",
		importCodesButton: "Kódok importálása",
		noSearchResultsFound: "Nincs találat",
		noSearchResultsFoundText: "Nincs találat a",
		dialog: {
			codesImported: "Kódok sikeresen importálva",
			noSaveFileFound: "Nincsenek elmentett kódjaid",
		},
	},

	import: {
		supportedTypes: "Támogatott 2FA típusok",
		totpQRCode: "TOTP QR kód",
		totpQRCodeText: "A TOTP QR kódokat találod mindenhol, ha 2FA-t akarsz beállítani. 6 számjegyből áll, amik 30 másodpercenként változnak.",
		instructions: "Útmutató",
		googleAuthQRCode: "Google Hitelesítő QR kód",
		googleAuthQRCodeText: "Ha a Google Hitelesítőt használod, akkor exportálhatod a kódjaidat és importálhatod az Authme-be.",
		chooseImportMethod: "Importálási mód kiválasztása",
		importFromImage: "Importálás képről",
		importFromImageText: "Válaszd ki a képeket, amik tartalmaznak kompatibilis QR kódokat.",
		chooseImageButton: "Kép kiválasztása",
		enterSecretManually: "Beállítókulcs megadása",
		enterSecretManuallyText: "Írd be kézzel a TOTP titkos kulcsát és a nevét.",
		enterSecretManuallyButton: "Beállítókulcs hozzáadása",
		screenCapture: "Képernyőről",
		screenCaptureText: "Importálj egy 2FA QR kódot a képernyődről.",
		screenCaptureButton: "Képernyőről",
		webcam: "Webkamera",
		webcamText: "Használd a webkamerádat egy 2FA QR kód beolvasásához.",
		webcamButton: "Webkamera",
		authmeFile: "Authme fájl",
		authmeFileText: "Importálj be minden kódot egy Authme import fájlból.",
		authmeFileButton: "Fájl kiválasztása",
		// translate dialogs
		captureScreenTitle: "Képernyőről importálás",
		captureScreenWaiting: "Várakozás a QR kódra...",
		manualEntry: "Kézi bevitel",
		manualEntryText: "Kérlek add meg a 2FA titkos kulcsát és a nevét!",
		manualEntryName: "Név (Kötelező)",
		manualEntrySecret: "Titkos kulcs (Kötelező)",
		manualEntryDescription: "Leírás",
		// tutorial
		googleAuthTutorialTitle: "Rövid útmutató, arról hogy hogyan importálhatod a kódjaidat az Authme-be a Google Hitelesítőből.",
		googleAuthTutorial0: "Exportáld a 2FA kódokat a Google Hitelesítő alkalmazásból: Kattints a hamburger menüre a képernyő tetején balra: Átvitel > Kódok exportálása",
		googleAuthTutorial1: "Mentsd el a migrációs QR kódot képernyőmentéssel vagy készíts egy képet egy másik telefonnal, ha Androidon vagy. Másold át ezeket a képeket a számítógépedre.",
		googleAuthTutorial2: "Az Authme-ben menj az Importálás oldalra: Oldalsáv > Importálás",
		googleAuthTutorial3: "Kattints a Képek kiválasztása gombra és válaszd ki a telefonodról átmásolt képeket",
		totpTutorialTitle: "Rövid útmutató, hogyan importálhatod a kódjaidat az Authme-be bármilyen TOTP 2FA QR kódból.",
		totpTutorial0: "Menj az oldalra, ahol 2FA-t akarsz beállítani",
		totpTutorial1: "Készíts egy képernyőmentést (Windows billentyű + Shift + S kombináció Windows-on, Cmd + Shift + 3 macOS-en) a QR kódról, és mentsd el a képet",
		totpTutorial2: "Az Authme-ben menj az Importálás oldalra: Oldalsáv > Importálás",
		totpTutorial3: "Kattints a Képek kiválasztása gombra és válaszd ki a telefonodról átmásolt képet",
	},

	export: {
		exportCodes: "Kódok exportálása",
		exportAuthmeFile: "Authme fájl exportálása",
		exportAuthmeFileText: "Ideal to import for Authme or other Authme apps.",
		exportHTMlFile: "HTML fájl exportálása",
		exportHTMlFileText: "Ideal for scanning the QR codes or for security backup.",
		exportFileButton: "Fájl exportálása",
	},

	edit: {
		editCodes: "Kódok módosítása",
		dialog: {
			deleteCode: "Biztos törölni akarod ezt a kódot?",
			saveChanges: "Biztos elmented a változtatásokat?",
		},
	},

	settings: {
		general: "Álltalános",
		launchOnStartup: "Indítás rendszerindításkor",
		launchOnStartupText: "Az Authme elindul a számítógép indításakor. Az Authme a tálcán fog indulni.",
		minimizeToTray: "Indítás a tálcán",
		minimizeToTrayText: "Az Authme bezárásakor nem zárul be. Az Authme-t a tálcáról tudod elindítani.",
		optionalAnalytics: "Opcionális statisztikák",
		optionalAnalyticsText: "Opcionális statisztikákat küldése, az elküldött adatok teljesen anonimok. Ez tartalmazza az Authme verzióját és az operációs rendszered verzióját.",
		windowCapture: "Ablak rögzítése",
		windowCaptureText: "Alapértelmezetten az Authme nem rögzíthető külső programok által. Ha ezt bekapcsolod, akkor ez addig érvényes, amíg újra nem indítod az Authme-t.",
		clearData: "Adatok törlése",
		clearDataText: "Töröld a jelszavadat, a 2FA kódjaidat és minden más beállítást. Vigyázz, ezt nem lehet visszavonni.",
		clearDataButton: "Adatok törlése",
		codes: "Kódok",
		codesDescription: "Kódok leírása",
		codesDescriptionText: "A 2FA kódok leírása látható lesz. Kattints rájuk a másoláshoz.",
		blurCodes: "Kódok elmosása",
		blurCodesText: "Elmosodnak a megjelenített kódok. Még mindig másolhatod a kódokat vagy vidd rájuk az egeret, hogy láthatóak legyenek.",
		codesLayout: "Kódok elrendezése",
		codesLayoutText: "Kiválaszthatod a kívánt elrendezést. A Grid több elemet jelenít meg és alkalmazkodik a képernyő méretéhez.",
		sortCodes: "Kódok rendezése",
		sortCodesText: "Válaszd ki, hogyan vannak rendezve a kódok. Alapértelmezetten a kódokat az importálás sorrendje szerint vannak.",
		shortcuts: "Gyorsbillentyűk",
		shortcutsEditButton: "Módosítás",
		shortcutsResetButton: "Alapértelmezett",
		shortcutsDeleteButton: "Törlés",
		about: "Névjegy",
		feedback: "Visszajelzés",
		feedbackText: "Köszönjük a visszajelzést! Kérlek jelentsd a problémákat vagy a funkciókérésedet a GitHub-on vagy e-mailben",
		logs: "Logs",
		logsText: "Megnézheted a log-okat ha valami problámát érzékelsz.",
		showLogsButton: "Log-ok mutatása",
		aboutAuthme: "Authme névjegye",
		aboutAuthmeText: "Információ az Authme build-edről és a számítógépedről",
	},
}