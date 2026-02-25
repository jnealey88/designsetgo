/**
 * Country calling codes for the phone field.
 *
 * Shared between edit.js (editor dropdown), save.js (static markup),
 * and view.js (frontend hydration).
 *
 * Sorted by region: North America, Europe, Asia-Pacific, Middle East,
 * Africa, Latin America.
 *
 * @since 2.0.32
 */

const COUNTRY_CODES = [
	// North America
	{ value: '+1', label: '+1 (US/Canada)' },

	// Europe
	{ value: '+44', label: '+44 (UK)' },
	{ value: '+353', label: '+353 (Ireland)' },
	{ value: '+33', label: '+33 (France)' },
	{ value: '+49', label: '+49 (Germany)' },
	{ value: '+43', label: '+43 (Austria)' },
	{ value: '+41', label: '+41 (Switzerland)' },
	{ value: '+31', label: '+31 (Netherlands)' },
	{ value: '+32', label: '+32 (Belgium)' },
	{ value: '+34', label: '+34 (Spain)' },
	{ value: '+39', label: '+39 (Italy)' },
	{ value: '+351', label: '+351 (Portugal)' },
	{ value: '+30', label: '+30 (Greece)' },
	{ value: '+46', label: '+46 (Sweden)' },
	{ value: '+47', label: '+47 (Norway)' },
	{ value: '+45', label: '+45 (Denmark)' },
	{ value: '+358', label: '+358 (Finland)' },
	{ value: '+48', label: '+48 (Poland)' },
	{ value: '+420', label: '+420 (Czech Republic)' },
	{ value: '+36', label: '+36 (Hungary)' },
	{ value: '+40', label: '+40 (Romania)' },
	{ value: '+380', label: '+380 (Ukraine)' },
	{ value: '+90', label: '+90 (Turkey)' },

	// Asia-Pacific
	{ value: '+81', label: '+81 (Japan)' },
	{ value: '+82', label: '+82 (South Korea)' },
	{ value: '+86', label: '+86 (China)' },
	{ value: '+886', label: '+886 (Taiwan)' },
	{ value: '+852', label: '+852 (Hong Kong)' },
	{ value: '+91', label: '+91 (India)' },
	{ value: '+92', label: '+92 (Pakistan)' },
	{ value: '+880', label: '+880 (Bangladesh)' },
	{ value: '+65', label: '+65 (Singapore)' },
	{ value: '+60', label: '+60 (Malaysia)' },
	{ value: '+62', label: '+62 (Indonesia)' },
	{ value: '+63', label: '+63 (Philippines)' },
	{ value: '+66', label: '+66 (Thailand)' },
	{ value: '+84', label: '+84 (Vietnam)' },
	{ value: '+61', label: '+61 (Australia)' },
	{ value: '+64', label: '+64 (New Zealand)' },

	// Middle East
	{ value: '+971', label: '+971 (UAE)' },
	{ value: '+966', label: '+966 (Saudi Arabia)' },
	{ value: '+972', label: '+972 (Israel)' },
	{ value: '+20', label: '+20 (Egypt)' },

	// Africa
	{ value: '+27', label: '+27 (South Africa)' },
	{ value: '+234', label: '+234 (Nigeria)' },
	{ value: '+254', label: '+254 (Kenya)' },
	{ value: '+233', label: '+233 (Ghana)' },

	// Latin America
	{ value: '+52', label: '+52 (Mexico)' },
	{ value: '+55', label: '+55 (Brazil)' },
	{ value: '+54', label: '+54 (Argentina)' },
	{ value: '+56', label: '+56 (Chile)' },
	{ value: '+57', label: '+57 (Colombia)' },
	{ value: '+51', label: '+51 (Peru)' },

	// Russia / CIS
	{ value: '+7', label: '+7 (Russia)' },
];

export default COUNTRY_CODES;
