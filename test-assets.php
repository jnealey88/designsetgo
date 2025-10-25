<?php
global $wp_scripts;
do_action('enqueue_block_editor_assets');

echo "=== DESIGNSETGO SCRIPTS ===\n";
foreach ($wp_scripts->registered as $handle => $script) {
    if (strpos($handle, 'designsetgo') !== false) {
        echo $handle . ":\n";
        echo "  " . $script->src . "\n\n";
    }
}
