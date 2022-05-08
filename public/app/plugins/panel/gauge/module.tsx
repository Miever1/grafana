import { PanelPlugin } from '@grafana/data';
import { GaugePanel } from './GaugePanel';
import { GaugeOptions } from './types';
import { addStandardDataReduceOptions } from '../stat/types';
import { gaugePanelMigrationHandler, gaugePanelChangedHandler } from './GaugeMigrations';

export const plugin = new PanelPlugin<GaugeOptions>(GaugePanel)
  .useFieldConfig()
  .setPanelOptions((builder) => {
    addStandardDataReduceOptions(builder, false);
    builder
      .addBooleanSwitch({
        path: 'showThresholdLabels',
        name: '显示基线标签',
        description: '渲染仪表条周围的基线阈值',
        defaultValue: false,
      })
      .addBooleanSwitch({
        path: 'showThresholdMarkers',
        name: '显示阈值区间',
        description: '将阈值呈现为外部线条',
        defaultValue: true,
      });
  })
  .setPanelChangeHandler(gaugePanelChangedHandler)
  .setMigrationHandler(gaugePanelMigrationHandler);
