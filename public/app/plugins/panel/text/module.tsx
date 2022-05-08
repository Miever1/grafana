import { PanelPlugin } from '@grafana/data';

import { TextPanel } from './TextPanel';
import { TextOptions } from './types';
import { textPanelMigrationHandler } from './textPanelMigrationHandler';
import { TextPanelEditor } from './TextPanelEditor';

export const plugin = new PanelPlugin<TextOptions>(TextPanel)
  .setPanelOptions((builder) => {
    builder
      .addRadio({
        path: 'mode',
        name: '模式',
        description: '面板的文本模式',
        settings: {
          options: [
            { value: 'markdown', label: 'Markdown' },
            { value: 'html', label: 'HTML' },
          ],
        },
        defaultValue: 'markdown',
      })
      .addCustomEditor({
        id: 'content',
        path: 'content',
        name: '内容',
        description: '编辑面板内容',
        defaultValue: `# Title

For markdown syntax help: [commonmark.org/help](https://commonmark.org/help/)
         `,
        editor: TextPanelEditor,
      });
  })
  .setMigrationHandler(textPanelMigrationHandler);
