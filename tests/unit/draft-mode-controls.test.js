/**
 * DraftModeControls Component - Unit Tests
 *
 * Tests for the draft mode controls component.
 *
 * @package
 */

import {
	render,
	screen,
	fireEvent,
	waitFor,
	act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import DraftModeControls from '../../src/extensions/draft-mode/DraftModeControls';
import * as api from '../../src/extensions/draft-mode/api';

// Mock the API module
jest.mock('../../src/extensions/draft-mode/api');

// Mock the utils module
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
	createPortal: (children) => children,
}));

jest.mock('@wordpress/components', () => ({
	Button: ({
		children,
		onClick,
		variant,
		disabled,
		href,
		isBusy,
		isDestructive,
		...props
	}) =>
		href ? (
			<a href={href} data-variant={variant} {...props}>
				{children}
			</a>
		) : (
			<button
				onClick={onClick}
				data-variant={variant}
				disabled={disabled}
				{...props}
			>
				{children}
			</button>
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

// Import after mocks
import { useSelect, useDispatch } from '@wordpress/data';

describe('DraftModeControls', () => {
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
			isSavingPost: false,
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

		// Mock document.querySelector for header container
		document.querySelector = jest.fn((selector) => {
			if (
				selector === '.editor-header__settings' ||
				selector === '.edit-post-header__settings'
			) {
				return document.createElement('div');
			}
			return null;
		});

		// Mock document.body
		if (!document.body) {
			document.body = document.createElement('body');
		}
	});

	describe('Initialization', () => {
		it('does not render for non-page post types', async () => {
			useSelect.mockReturnValue({
				postId: 123,
				postType: 'post',
				postStatus: 'publish',
				hasEdits: false,
				isSavingPost: false,
				currentContent: '',
				currentTitle: '',
				currentExcerpt: '',
			});

			let container;
			await act(async () => {
				const result = render(<DraftModeControls />);
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
				render(<DraftModeControls />);
			});

			await waitFor(() => {
				expect(
					screen.queryByText('Create Draft')
				).not.toBeInTheDocument();
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
				settings: { enabled: true },
			});
		});

		it('shows edit draft button', async () => {
			await act(async () => {
				render(<DraftModeControls />);
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
			useSelect.mockReturnValue({
				postId: 456,
				postType: 'page',
				postStatus: 'draft',
				hasEdits: true,
				isSavingPost: false,
				currentContent: 'Draft content',
				currentTitle: 'Draft title',
				currentExcerpt: 'Draft excerpt',
			});

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

		it('shows save draft button when there are edits', async () => {
			await act(async () => {
				render(<DraftModeControls />);
			});

			await waitFor(() => {
				expect(screen.getByText('Save Draft')).toBeInTheDocument();
			});
		});

		it('does not show save draft button when no edits', async () => {
			useSelect.mockReturnValue({
				postId: 456,
				postType: 'page',
				postStatus: 'draft',
				hasEdits: false,
				isSavingPost: false,
				currentContent: 'Draft content',
				currentTitle: 'Draft title',
				currentExcerpt: 'Draft excerpt',
			});

			await act(async () => {
				render(<DraftModeControls />);
			});

			await waitFor(() => {
				expect(
					screen.queryByText('Save Draft')
				).not.toBeInTheDocument();
			});
		});

		it('shows saving state when saving', async () => {
			useSelect.mockReturnValue({
				postId: 456,
				postType: 'page',
				postStatus: 'draft',
				hasEdits: true,
				isSavingPost: true,
				currentContent: 'Draft content',
				currentTitle: 'Draft title',
				currentExcerpt: 'Draft excerpt',
			});

			await act(async () => {
				render(<DraftModeControls />);
			});

			await waitFor(() => {
				expect(screen.getByText('Saving…')).toBeInTheDocument();
			});
		});

		it('shows draft editing banner', async () => {
			await act(async () => {
				render(<DraftModeControls />);
			});

			await waitFor(() => {
				expect(
					screen.getByText('You are editing a draft version.')
				).toBeInTheDocument();
			});
		});

		it('shows view live page link with aria-label', async () => {
			await act(async () => {
				render(<DraftModeControls />);
			});

			await waitFor(() => {
				const link = screen.getByText('View live page');
				expect(link).toBeInTheDocument();
				expect(link).toHaveAttribute(
					'href',
					'https://example.com/original-page'
				);
				expect(link).toHaveAttribute(
					'aria-label',
					'View live page (opens in new tab)'
				);
			});
		});

		it('saves draft when save button clicked', async () => {
			await act(async () => {
				render(<DraftModeControls />);
			});

			await waitFor(() => {
				expect(screen.getByText('Save Draft')).toBeInTheDocument();
			});

			await act(async () => {
				fireEvent.click(screen.getByText('Save Draft'));
			});

			expect(mockSavePost).toHaveBeenCalled();
		});
	});
});
