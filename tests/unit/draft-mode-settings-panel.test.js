/**
 * Draft Mode Settings Panel Tests
 *
 * @package
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import DraftModePanel from '../../src/admin/components/settings-panels/DraftModePanel';

describe('DraftModePanel', () => {
	const mockUpdateSetting = jest.fn();

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('Rendering', () => {
		it('renders the panel with title and description', () => {
			const settings = {
				draft_mode: {
					enable: true,
					show_page_list_actions: true,
					show_page_list_column: true,
				},
			};

			render(
				<DraftModePanel
					settings={settings}
					updateSetting={mockUpdateSetting}
				/>
			);

			expect(screen.getByText('Draft Mode')).toBeInTheDocument();
			expect(
				screen.getByText(
					/Configure draft mode for safely editing published pages/i
				)
			).toBeInTheDocument();
		});

		it('renders all toggle controls when enabled', () => {
			const settings = {
				draft_mode: {
					enable: true,
					show_page_list_actions: true,
					show_page_list_column: true,
				},
			};

			render(
				<DraftModePanel
					settings={settings}
					updateSetting={mockUpdateSetting}
				/>
			);

			expect(
				screen.getByLabelText('Enable Draft Mode')
			).toBeInTheDocument();
			expect(
				screen.getByLabelText('Show Page List Actions')
			).toBeInTheDocument();
			expect(
				screen.getByLabelText('Show Draft Status Column')
			).toBeInTheDocument();
		});

		it('hides admin interface settings when draft mode is disabled', () => {
			const settings = {
				draft_mode: {
					enable: false,
					show_page_list_actions: true,
					show_page_list_column: true,
				},
			};

			render(
				<DraftModePanel
					settings={settings}
					updateSetting={mockUpdateSetting}
				/>
			);

			expect(
				screen.getByLabelText('Enable Draft Mode')
			).toBeInTheDocument();
			expect(
				screen.queryByLabelText('Show Page List Actions')
			).not.toBeInTheDocument();
			expect(
				screen.queryByLabelText('Show Draft Status Column')
			).not.toBeInTheDocument();
		});
	});

	describe('Default Values', () => {
		it('defaults to enabled when settings are undefined', () => {
			render(
				<DraftModePanel
					settings={{}}
					updateSetting={mockUpdateSetting}
				/>
			);

			const enableToggle = screen.getByLabelText('Enable Draft Mode');
			expect(enableToggle).toBeChecked();
		});

		it('defaults to showing page list actions when undefined', () => {
			const settings = {
				draft_mode: {
					enable: true,
				},
			};

			render(
				<DraftModePanel
					settings={settings}
					updateSetting={mockUpdateSetting}
				/>
			);

			const pageListActionsToggle = screen.getByLabelText(
				'Show Page List Actions'
			);
			expect(pageListActionsToggle).toBeChecked();
		});

		it('defaults to showing page list column when undefined', () => {
			const settings = {
				draft_mode: {
					enable: true,
				},
			};

			render(
				<DraftModePanel
					settings={settings}
					updateSetting={mockUpdateSetting}
				/>
			);

			const pageListColumnToggle = screen.getByLabelText(
				'Show Draft Status Column'
			);
			expect(pageListColumnToggle).toBeChecked();
		});
	});

	describe('User Interactions', () => {
		it('calls updateSetting when enabling draft mode', async () => {
			const user = userEvent.setup();
			const settings = {
				draft_mode: {
					enable: false,
				},
			};

			render(
				<DraftModePanel
					settings={settings}
					updateSetting={mockUpdateSetting}
				/>
			);

			const enableToggle = screen.getByLabelText('Enable Draft Mode');
			await user.click(enableToggle);

			expect(mockUpdateSetting).toHaveBeenCalledWith(
				'draft_mode',
				'enable',
				true
			);
		});

		it('calls updateSetting when disabling draft mode', async () => {
			const user = userEvent.setup();
			const settings = {
				draft_mode: {
					enable: true,
				},
			};

			render(
				<DraftModePanel
					settings={settings}
					updateSetting={mockUpdateSetting}
				/>
			);

			const enableToggle = screen.getByLabelText('Enable Draft Mode');
			await user.click(enableToggle);

			expect(mockUpdateSetting).toHaveBeenCalledWith(
				'draft_mode',
				'enable',
				false
			);
		});

		it('calls updateSetting when toggling page list actions', async () => {
			const user = userEvent.setup();
			const settings = {
				draft_mode: {
					enable: true,
					show_page_list_actions: true,
				},
			};

			render(
				<DraftModePanel
					settings={settings}
					updateSetting={mockUpdateSetting}
				/>
			);

			const pageListActionsToggle = screen.getByLabelText(
				'Show Page List Actions'
			);
			await user.click(pageListActionsToggle);

			expect(mockUpdateSetting).toHaveBeenCalledWith(
				'draft_mode',
				'show_page_list_actions',
				false
			);
		});

		it('calls updateSetting when toggling page list column', async () => {
			const user = userEvent.setup();
			const settings = {
				draft_mode: {
					enable: true,
					show_page_list_column: true,
				},
			};

			render(
				<DraftModePanel
					settings={settings}
					updateSetting={mockUpdateSetting}
				/>
			);

			const pageListColumnToggle = screen.getByLabelText(
				'Show Draft Status Column'
			);
			await user.click(pageListColumnToggle);

			expect(mockUpdateSetting).toHaveBeenCalledWith(
				'draft_mode',
				'show_page_list_column',
				false
			);
		});
	});

	describe('Accessibility', () => {
		it('includes help text for all toggle controls', () => {
			const settings = {
				draft_mode: {
					enable: true,
					show_page_list_actions: true,
					show_page_list_column: true,
				},
			};

			render(
				<DraftModePanel
					settings={settings}
					updateSetting={mockUpdateSetting}
				/>
			);

			expect(
				screen.getByText(
					/Allow creating draft versions of published pages/i
				)
			).toBeInTheDocument();
			expect(
				screen.getByText(
					/Display "Create Draft" and "Edit Draft" links/i
				)
			).toBeInTheDocument();
			expect(
				screen.getByText(/Display a "Draft Status" column/i)
			).toBeInTheDocument();
		});

		it('uses proper heading hierarchy', () => {
			const settings = {
				draft_mode: {
					enable: true,
				},
			};

			render(
				<DraftModePanel
					settings={settings}
					updateSetting={mockUpdateSetting}
				/>
			);

			const mainHeading = screen.getByRole('heading', {
				level: 2,
				name: 'Draft Mode',
			});
			const subHeadings = screen.getAllByRole('heading', { level: 3 });

			expect(mainHeading).toBeInTheDocument();
			expect(subHeadings.length).toBeGreaterThan(0);
		});
	});

	describe('Edge Cases', () => {
		it('handles null settings gracefully', () => {
			render(
				<DraftModePanel
					settings={null}
					updateSetting={mockUpdateSetting}
				/>
			);

			const enableToggle = screen.getByLabelText('Enable Draft Mode');
			expect(enableToggle).toBeChecked(); // Should default to true
		});

		it('handles undefined settings gracefully', () => {
			render(
				<DraftModePanel
					settings={undefined}
					updateSetting={mockUpdateSetting}
				/>
			);

			const enableToggle = screen.getByLabelText('Enable Draft Mode');
			expect(enableToggle).toBeChecked(); // Should default to true
		});

		it('handles partial settings object', () => {
			const settings = {
				draft_mode: {
					enable: true,
					// show_page_list_actions intentionally missing
					show_page_list_column: false,
				},
			};

			render(
				<DraftModePanel
					settings={settings}
					updateSetting={mockUpdateSetting}
				/>
			);

			const pageListActionsToggle = screen.getByLabelText(
				'Show Page List Actions'
			);
			const pageListColumnToggle = screen.getByLabelText(
				'Show Draft Status Column'
			);

			expect(pageListActionsToggle).toBeChecked(); // Should default to true
			expect(pageListColumnToggle).not.toBeChecked(); // Should use provided value
		});
	});
});
