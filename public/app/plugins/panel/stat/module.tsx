import { BigValueTextMode, sharedSingleStatMigrationHandler } from '@grafana/ui';
import { PanelPlugin } from '@grafana/data';
import { addStandardDataReduceOptions, StatPanelOptions } from './types';
import { StatPanel } from './StatPanel';
import { statPanelChangedHandler } from './StatMigrations';

export const plugin = new PanelPlugin<StatPanelOptions>(StatPanel)
  .useFieldConfig()
  .setPanelOptions((builder) => {
    addStandardDataReduceOptions(builder);

    builder.addSelect({
      path: 'textMode',
      name: '文本模式',
      description: '控制是否显示名称和值或仅显示名称',
      settings: {
        options: [
          { value: BigValueTextMode.Auto, label: 'Auto' },
          { value: BigValueTextMode.Value, label: 'Value' },
          { value: BigValueTextMode.ValueAndName, label: 'Value and name' },
          { value: BigValueTextMode.Name, label: 'Name' },
          { value: BigValueTextMode.None, label: 'None' },
        ],
      },
      defaultValue: 'auto',
    });

    builder
      .addRadio({
        path: 'colorMode',
        name: '颜色模式',
        description: 'Color either the value or the background',
        defaultValue: 'value',
        settings: {
          options: [
            { value: 'value', label: '值' },
            { value: 'background', label: '背景填充' },
          ],
        },
      })
      .addRadio({
        path: 'graphMode',
        name: '图表模式',
        description: 'Stat panel graph / sparkline mode',
        defaultValue: 'area',
        settings: {
          options: [
            { value: 'none', label: '统计面板图' },
            { value: 'area', label: '迷你图' },
          ],
        },
      })
      .addRadio({
        path: 'justifyMode',
        name: '文本对齐',
        description: 'Value & title posititioning',
        defaultValue: 'auto',
        settings: {
          options: [
            { value: 'auto', label: '自动' },
            { value: 'center', label: '居中' },
          ],
        },
      });
  })
  .setNoPadding()
  .setPanelChangeHandler(statPanelChangedHandler)
  .setMigrationHandler(sharedSingleStatMigrationHandler);
