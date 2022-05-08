import { PanelPlugin } from '@grafana/data';
import { GraphFieldConfig } from '@grafana/ui';
import { TimeSeriesPanel } from './TimeSeriesPanel';
import { graphPanelChangedHandler } from './migrations';
import { Options } from './types';
import { addLegendOptions, defaultGraphConfig, getGraphFieldConfig } from './config';

export const plugin = new PanelPlugin<Options, GraphFieldConfig>(TimeSeriesPanel)
  .setPanelChangeHandler(graphPanelChangedHandler)
  .useFieldConfig(getGraphFieldConfig(defaultGraphConfig))
  .setPanelOptions((builder) => {
    builder.addRadio({
      path: 'tooltipOptions.mode',
      name: '图例提示方式',
      description: '',
      defaultValue: 'single',
      settings: {
        options: [
          { value: 'single', label: '单点' },
          { value: 'multi', label: '所有点' },
          { value: 'none', label: '隐藏' },
        ],
      },
    });
    addLegendOptions(builder);
  });
