[x] heading and paragraphs aren't respecting the parent stack containers width constraints only in the block editor. On the front end, it is working properly.
[x] Grids have the same issue. in the editor it's not respecting the parent stack containers width. On the front end it works fine.
[x] Flex container - Block spacing adds top block spacing to the 2nd + blocks when it should actually be spacing between elements like you'd expect gap would do or how it's handled in the wp core row block.
[] Flex container - setting width fit grow fixed doesn't seem to do anything.
[x] Nested stack container doesn't go full width the parent sets in the editor. It's computing very small, just of the content within it. On the front end it's all working properly.
[] setting content size of a stack container within a dsg flex row works on the front end but it stays it's normal width in the editor
[] Blobs are stuck align left in the editor even after setting alignment. It's fine on the front end.
[]When pasting a block while a container is focused on, it should add it to the end of the containter, within it. Current state, it replaces it no matter what.
