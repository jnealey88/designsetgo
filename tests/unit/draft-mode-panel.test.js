/**
 * DraftModePanel Component - Unit Tests
 *
 * Tests for the draft mode panel sidebar component.
 *
 * @package
 */

import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DraftModePanel from '../../src/extensions/draft-mode/DraftModePanel';
import * as api from '../../src/extensions/draft-mode/api';

// Mock the API module
jest.mock('../../src/extensions/draft-mode/api');

// Mock utils module
jest.mock('../../src/extensions/draft-mode/utils', () => ({
	clearDirtyState: jest.fn(),
}));

// Mock WordPress dependencies
jest.mock('@wordpress/i18n', () => ({
	__: (text) => text,
}));

jest.mock('@wordpress/data', () => ({
	useSelect: jest.fn(),
	useDispatch: jest.fn(),
}));

jest.mock('@wordpress/element', () => ({
	...jest.requireActual('react'),
}));

jest.mock('@wordpress/components', () => ({
	Notice: ({ children }) => <div data-testid="notice">{children}</div>,
	Spinner: () => <div data-testid="spinner">Loading...</div>,
	Button: ({ children, onClick, variant, isBusy, isDestructive, ...props }) => (
		<button onClick={onClick} data-variant={variant} {...props}>
			{children}
		</button>
	),
	ExternalLink: ({ children, href }) => (
		<a href={href} target="_blank" rel="noopener noreferrer">
			{children}
		</a>
	),
	Modal: ({ children, title, onRequestClose }) => (
		<div data-testid="modal" role="dialog">
			<h2>{title}</h2>
			<button onClick={onRequestClose}>Close</button>
			{children}
		</div>
	),
	Flex: ({ children }) => <div>{children}</div>,
	FlexItem: ({ children }) => <div>{children}</div>,
}));

jest.mock('@wordpress/editor', () => ({
	PluginDocumentSettingPanel: ({ children, title }) => (
		<div data-testid="plugin-panel">
			<h3>{title}</h3>
			{children}
		</div>
	),
}));

// Import after mocks
import { useSelect, useDispatch } from '@wordpress/data';

describe('DraftModePanel', () => {
	const mockSavePost = jest.fn();
	const mockGetDraftStatus = api.getDraftStatus;

	beforeEach(() => {
		jest.clearAllMocks();

		// Default mock implementations
		useSelect.mockReturnValue({
			postId: 123,
			postType: 'page',
			postStatus: 'publish',
			hasEdits: false,
			currentContent: 'Test content',
			currentTitle: 'Test title',
			currentExcerpt: 'Test excerpt',
		});

		useDispatch.mockReturnValue({
			savePost: mockSavePost,
		});

		mockGetDraftStatus.mockResolvedValue({
			exists: true,
			is_draft: false,
			has_draft: false,
			settings: { enabled: true },
		});
	});

	describe('Initial State', () => {
		it('does not render for non-page post types', async () => {
			useSelect.mockReturnValue({
				postId: 123,
				postType: 'post',
				postStatus: 'publish',
				hasEdits: false,
				currentContent: '',
				currentTitle: '',
				currentExcerpt: '',
			});

			let container;
			await act(async () => {
				const result = render(<DraftModePanel />);
				container = result.container;
			});

			expect(container.firstChild).toBeNull();
		});

		it('does not render when draft mode is disabled', async () => {
			mockGetDraftStatus.mockResolvedValue({
				exists: true,
				is_draft: false,
				has_draft: false,
				settings: { enabled: false },
			});

			await act(async () => {
				render(<DraftModePanel />);
			});

			await waitFor(() => {
				expect(screen.queryByTestId('plugin-panel')).not.toBeInTheDocument();
			});
		});
	});

	describe('Published Page Without Draft', () => {
		beforeEach(() => {
			mockGetDraftStatus.mockResolvedValue({
				exists: true,
				is_draft: false,
				has_draft: false,
				settings: { enabled: true },
			});
		});

		it('shows create draft button', async () => {
			await act(async () => {
				render(<DraftModePanel />);
			});

			await waitFor(() => {
				expect(screen.getByText('Create Draft')).toBeInTheDocument();
			});
		});
	});

	describe('Published Page With Draft', () => {
		beforeEach(() => {
			mockGetDraftStatus.mockResolvedValue({
				exists: true,
				is_draft: false,
				has_draft: true,
				draft_id: 456,
				draft_edit_url: '/wp-admin/post.php?post=456&action=edit',
				draft_created: '2024-01-15 10:30:00',
				settings: { enabled: true },
			});
		});

		it('shows draft exists notice', async () => {
			await act(async () => {
				render(<DraftModePanel />);
			});

			await waitFor(() => {
				expect(
					screen.getByText('A draft version exists for this page.')
				).toBeInTheDocument();
			});
		});

		it('shows edit draft button', async () => {
			await act(async () => {
				render(<DraftModePanel />);
			});

			await waitFor(() => {
				const button = screen.getByText('Edit Draft');
				expect(button).toBeInTheDocument();
				expect(button).toHaveAttribute(
					'href',
					'/wp-admin/post.php?post=456&action=edit'
				);
			});
		});
	});

	describe('Draft Page (Editing Draft)', () => {
		beforeEach(() => {
			mockGetDraftStatus.mockResolvedValue({
				exists: true,
				is_draft: true,
				has_draft: false,
				draft_id: 456,
				original_id: 123,
				original_title: 'Original Page',
				original_view_url: 'https://example.com/original-page',
				settings: { enabled: true },
			});
		});

		it('shows publish changes button', async () => {
			await act(async () => {
				render(<DraftModePanel />);
			});

			await waitFor(() => {
				expect(screen.getByText('Publish Changes')).toBeInTheDocument();
			});
		});

		it('shows discard draft button', async () => {
			await act(async () => {
				render(<DraftModePanel />);
			});

			await waitFor(() => {
				expect(screen.getByText('Discard Draft')).toBeInTheDocument();
			});
		});
	});
});
