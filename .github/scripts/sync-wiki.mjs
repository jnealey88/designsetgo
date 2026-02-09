/**
 * Syncs docs/ markdown files to the GitHub wiki repository.
 *
 * Environment variables:
 *   MAIN_REPO_PATH  - Path to the main repo checkout (default: ".")
 *   WIKI_REPO_PATH  - Path to the wiki repo checkout (default: "../designsetgo.wiki")
 *   GITHUB_REPO     - GitHub owner/repo (default: "jnealey88/designsetgo")
 *
 * Usage:
 *   node .github/scripts/sync-wiki.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join, dirname, basename, normalize, extname, relative } from 'path';

// --- Configuration ---

const MAIN_REPO_PATH = process.env.MAIN_REPO_PATH || '.';
const WIKI_REPO_PATH = process.env.WIKI_REPO_PATH || '../designsetgo.wiki';
const GITHUB_REPO = process.env.GITHUB_REPO || 'jnealey88/designsetgo';
const GITHUB_BASE_URL = `https://github.com/${GITHUB_REPO}`;
const DOCS_DIR = join(MAIN_REPO_PATH, 'docs');

// Categories in sidebar display order
const CATEGORY_ORDER = [
	'_root',
	'blocks',
	'extensions',
	'api',
	'guides',
	'patterns',
	'planning',
	'compliance',
	'formats',
	'testing',
	'troubleshooting',
	'audits',
];

const CATEGORY_LABELS = {
	_root: 'Getting Started',
	blocks: 'Blocks',
	extensions: 'Extensions',
	api: 'API Reference',
	guides: 'Development Guides',
	patterns: 'Patterns',
	planning: 'Planning & Roadmap',
	compliance: 'Compliance',
	formats: 'Formats',
	testing: 'Testing',
	troubleshooting: 'Troubleshooting',
	audits: 'Audits',
};

// --- Discovery ---

function discoverMarkdownFiles(dir, base = '') {
	const results = [];
	for (const entry of readdirSync(dir)) {
		const fullPath = join(dir, entry);
		const relPath = base ? `${base}/${entry}` : entry;
		if (statSync(fullPath).isDirectory()) {
			results.push(...discoverMarkdownFiles(fullPath, relPath));
		} else if (extname(entry).toLowerCase() === '.md') {
			results.push(relPath);
		}
	}
	return results;
}

// --- Name Mapping ---

function titleCase(str) {
	return str
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join('-');
}

function sourcePathToWikiName(relPath) {
	if (relPath === 'README.md') {
		return 'Home';
	}

	const parts = relPath.split('/');
	const filename = parts[parts.length - 1];
	const stem = filename.replace(/\.md$/i, '');
	const category = parts.length > 1 ? parts[0] : null;
	const titleStem = titleCase(stem);

	if (category) {
		const titleCategory = titleCase(category);
		return `${titleCategory}-${titleStem}`;
	}

	return titleStem;
}

function buildNameMap(relativePaths) {
	const nameMap = new Map();
	const usedNames = new Map();

	for (const relPath of relativePaths) {
		const wikiName = sourcePathToWikiName(relPath);

		if (usedNames.has(wikiName)) {
			console.warn(
				`WARNING: Wiki name collision "${wikiName}" for both "${usedNames.get(wikiName)}" and "${relPath}"`
			);
		}

		nameMap.set(relPath, wikiName);
		usedNames.set(wikiName, relPath);
	}

	return nameMap;
}

function buildReverseMap(relativePaths) {
	const reverseMap = new Map();
	for (const relPath of relativePaths) {
		const key = basename(relPath).toLowerCase();
		if (!reverseMap.has(key)) {
			reverseMap.set(key, relPath);
		}
	}
	return reverseMap;
}

// --- Link Transformation ---

function splitAnchor(linkUrl) {
	const hashIndex = linkUrl.indexOf('#');
	if (hashIndex === -1) {
		return [linkUrl, ''];
	}
	return [linkUrl.slice(0, hashIndex), linkUrl.slice(hashIndex)];
}

function resolveExternalLink(rawPath, anchor) {
	let repoRelative = rawPath;

	// Handle colon-based line numbers: "edit.js:137" -> "edit.js" + "#L137"
	let lineAnchor = '';
	const colonMatch = repoRelative.match(/^(.+):(\d+)(-(\d+))?$/);
	if (colonMatch) {
		repoRelative = colonMatch[1];
		lineAnchor = `#L${colonMatch[2]}`;
		if (colonMatch[4]) {
			lineAnchor += `-L${colonMatch[4]}`;
		}
	}

	const finalAnchor = anchor || lineAnchor;
	return `${GITHUB_BASE_URL}/blob/main/${repoRelative}${finalAnchor}`;
}

function transformSingleLink(rawUrl, sourceRelPath, nameMap, reverseMap) {
	// Pure anchor links
	if (rawUrl.startsWith('#')) {
		return rawUrl;
	}

	// External URLs
	if (/^https?:\/\/|^mailto:/.test(rawUrl)) {
		return rawUrl;
	}

	const [rawPath, anchor] = splitAnchor(rawUrl);

	// Source code links (repo-root-relative, no leading ./ or ../)
	if (/^(src|includes|tests|scripts)\//.test(rawPath)) {
		return resolveExternalLink(rawPath, anchor);
	}

	// Directory links (end with / or have no extension) - link to GitHub tree
	if (rawPath.endsWith('/') || (!extname(rawPath) && !rawPath.startsWith('..'))) {
		const sourceDir = dirname(sourceRelPath);
		const resolved = normalize(join(sourceDir, rawPath));
		if (resolved.startsWith('..')) {
			const repoRelative = resolved.replace(/^\.\.\//, '');
			return `${GITHUB_BASE_URL}/tree/main/${repoRelative}`;
		}
		return `${GITHUB_BASE_URL}/tree/main/docs/${resolved}`;
	}

	// Resolve relative to source file's directory within docs/
	const sourceDir = dirname(sourceRelPath);
	const resolved = normalize(join(sourceDir, rawPath));

	// If resolved path escapes docs/ (starts with ..)
	if (resolved.startsWith('..')) {
		// Strip the leading ../ that escapes docs/
		const repoRelative = resolved.replace(/^\.\.\//, '');
		return resolveExternalLink(repoRelative, anchor);
	}

	// Check if it's a known markdown file in our map
	if (nameMap.has(resolved)) {
		return nameMap.get(resolved) + anchor;
	}

	// Resolved path is inside docs/ but not in our map - might be a repo-root path
	// that was written without ../ prefix (e.g., ".claude/CLAUDE.md" from a subdir)
	if (!resolved.startsWith('..') && !existsSync(join(DOCS_DIR, resolved))) {
		// Check if it exists relative to repo root instead
		const repoPath = join(MAIN_REPO_PATH, resolved);
		if (existsSync(repoPath)) {
			return resolveExternalLink(resolved, anchor);
		}
	}

	// Non-markdown file inside docs/ (e.g., .js template)
	if (extname(resolved) && extname(resolved).toLowerCase() !== '.md') {
		return `${GITHUB_BASE_URL}/blob/main/docs/${resolved}${anchor}`;
	}

	// Try bare filename reverse lookup
	const lookupKey = basename(resolved).toLowerCase();
	if (reverseMap.has(lookupKey) && nameMap.has(reverseMap.get(lookupKey))) {
		return nameMap.get(reverseMap.get(lookupKey)) + anchor;
	}

	// Unresolvable - keep as-is silently (many docs have broken internal links)
	return rawUrl;
}

function transformLinks(content, sourceRelPath, nameMap, reverseMap) {
	// Match markdown links: [text](url) and ![alt](url)
	return content.replace(/(!?\[[^\]]*\])\(([^)]+)\)/g, (match, textPart, url) => {
		const transformed = transformSingleLink(url, sourceRelPath, nameMap, reverseMap);
		return `${textPart}(${transformed})`;
	});
}

// --- Footer ---

function appendFooter(content, sourceRelPath) {
	const sourceUrl = `${GITHUB_BASE_URL}/blob/main/docs/${sourceRelPath}`;
	const footer = [
		'',
		'---',
		'',
		`> *Auto-generated from [\`docs/${sourceRelPath}\`](${sourceUrl}). To update, edit the source file and changes will sync on next push to main.*`,
		'',
	].join('\n');
	return content.trimEnd() + '\n' + footer;
}

// --- Sidebar Generation ---

function wikiNameToDisplayName(wikiName, category) {
	if (category === '_root') {
		// Root-level pages: convert hyphens to spaces ("Getting-Started" -> "Getting Started")
		return wikiName.replace(/-/g, ' ');
	}
	// Category pages: strip the "Category-" prefix, then convert hyphens to spaces
	const prefix = titleCase(category) + '-';
	const stripped = wikiName.startsWith(prefix) ? wikiName.slice(prefix.length) : wikiName;
	return stripped.replace(/-/g, ' ');
}

function generateSidebar(nameMap) {
	const groups = new Map();
	groups.set('_root', []);

	for (const [relPath, wikiName] of nameMap) {
		if (wikiName === 'Home') continue;

		const parts = relPath.split('/');
		const category = parts.length > 1 ? parts[0] : '_root';

		if (!groups.has(category)) {
			groups.set(category, []);
		}
		groups.get(category).push(wikiName);
	}

	// Sort entries within each group
	for (const entries of groups.values()) {
		entries.sort((a, b) => a.localeCompare(b));
	}

	let sidebar = '**[Home](Home)**\n\n';

	// Ordered categories first
	for (const cat of CATEGORY_ORDER) {
		const entries = groups.get(cat);
		if (!entries || entries.length === 0) continue;
		const label = CATEGORY_LABELS[cat] || titleCase(cat);
		sidebar += `### ${label}\n`;
		for (const name of entries) {
			const displayName = wikiNameToDisplayName(name, cat);
			sidebar += `- [${displayName}](${name})\n`;
		}
		sidebar += '\n';
	}

	// Any categories not in the predefined order
	for (const [cat, entries] of groups) {
		if (CATEGORY_ORDER.includes(cat) || entries.length === 0) continue;
		const label = CATEGORY_LABELS[cat] || titleCase(cat);
		sidebar += `### ${label}\n`;
		for (const name of entries) {
			const displayName = wikiNameToDisplayName(name, cat);
			sidebar += `- [${displayName}](${name})\n`;
		}
		sidebar += '\n';
	}

	sidebar += '---\n\n';
	sidebar += `**[GitHub](${GITHUB_BASE_URL})** | **[Report Issue](${GITHUB_BASE_URL}/issues)**\n`;

	return sidebar;
}

// --- Main ---

function main() {
	console.log(`Syncing docs from ${DOCS_DIR} to ${WIKI_REPO_PATH}`);

	// 1. Discover markdown files
	const relativePaths = discoverMarkdownFiles(DOCS_DIR);
	console.log(`Found ${relativePaths.length} markdown files in docs/`);

	// 2. Build maps
	const nameMap = buildNameMap(relativePaths);
	const reverseMap = buildReverseMap(relativePaths);

	// 3. Clean wiki directory (preserve .git)
	if (existsSync(WIKI_REPO_PATH)) {
		for (const entry of readdirSync(WIKI_REPO_PATH)) {
			if (entry === '.git') continue;
			const fullPath = join(WIKI_REPO_PATH, entry);
			rmSync(fullPath, { recursive: true, force: true });
		}
	} else {
		mkdirSync(WIKI_REPO_PATH, { recursive: true });
	}

	// 4. Process and write each file
	let processed = 0;
	for (const [relPath, wikiName] of nameMap) {
		const sourcePath = join(DOCS_DIR, relPath);
		let content = readFileSync(sourcePath, 'utf-8');

		content = transformLinks(content, relPath, nameMap, reverseMap);
		content = appendFooter(content, relPath);

		const destPath = join(WIKI_REPO_PATH, `${wikiName}.md`);
		writeFileSync(destPath, content, 'utf-8');
		processed++;
	}
	console.log(`Wrote ${processed} wiki pages`);

	// 5. Generate sidebar
	const sidebar = generateSidebar(nameMap);
	writeFileSync(join(WIKI_REPO_PATH, '_Sidebar.md'), sidebar, 'utf-8');
	console.log('Generated _Sidebar.md');

	// 6. Print summary
	console.log('\nSync complete. Wiki pages:');
	for (const [relPath, wikiName] of nameMap) {
		console.log(`  docs/${relPath} -> ${wikiName}.md`);
	}
}

main();
