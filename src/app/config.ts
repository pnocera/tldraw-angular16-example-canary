import {
  TLUiMenuGroup,
  TLUiOverrides,
  menuItem,
  toolbarItem,
} from '@tldraw/tldraw';

// In order to see select our custom shape tool, we need to add it to the ui.

export const uiOverrides: TLUiOverrides = {
  tools(editor, tools) {
    // Create a tool item in the ui's context.
    tools['state'] = {
      id: 'state',
      icon: 'geo-rectangle',
      label: 'State' as any,
      kbd: 's',
      readonlyOk: false,
      onSelect: () => {
        editor.setSelectedTool('state');
      },
    };
    return tools;
  },
  toolbar(_app, toolbar, { tools }) {
    // Add the tool item from the context to the toolbar.
    toolbar.splice(4, 0, toolbarItem(tools['state']));
    return toolbar;
  },
  keyboardShortcutsMenu(_app, keyboardShortcutsMenu, { tools }) {
    // Add the tool item from the context to the keyboard shortcuts dialog.
    const toolsGroup = keyboardShortcutsMenu.find(
      (group) => group.id === 'shortcuts-dialog.tools'
    ) as TLUiMenuGroup;
    toolsGroup.children.push(menuItem(tools['state']));
    return keyboardShortcutsMenu;
  },
};
