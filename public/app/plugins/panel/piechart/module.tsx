import { FieldColorModeId, FieldConfigProperty, PanelPlugin } from '@grafana/data';
import { PieChartPanel } from './PieChartPanel';
import { PieChartOptions } from './types';
import { addStandardDataReduceOptions } from '../stat/types';
import { LegendDisplayMode, PieChartType, PieChartLabels, PieChartLegendValues } from '@grafana/ui';
import { PieChartPanelChangedHandler } from './migrations';

export const plugin = new PanelPlugin<PieChartOptions>(PieChartPanel)
  .setPanelChangeHandler(PieChartPanelChangedHandler)
  .useFieldConfig({
    standardOptions: {
      [FieldConfigProperty.Color]: {
        settings: {
          byValueSupport: false,
          bySeriesSupport: true,
          preferThresholdsMode: false,
        },
        defaultValue: {
          mode: FieldColorModeId.PaletteClassic,
        },
      },
    },
  })
  .setPanelOptions((builder) => {
    addStandardDataReduceOptions(builder, false);

    builder
      .addRadio({
        name: 'Piechart type',
        description: 'How the piechart should be rendered',
        path: 'pieType',
        settings: {
          options: [
            { value: PieChartType.Pie, label: 'Pie' },
            { value: PieChartType.Donut, label: 'Donut' },
          ],
        },
        defaultValue: PieChartType.Pie,
      })
      .addMultiSelect({
        name: 'Labels',
        path: 'displayLabels',
        description: 'Select the labels to be displayed in the pie chart',
        settings: {
          options: [
            { value: PieChartLabels.Percent, label: 'Percent' },
            { value: PieChartLabels.Name, label: 'Name' },
            { value: PieChartLabels.Value, label: 'Value' },
          ],
        },
      })
      .addRadio({
        path: 'legend.displayMode',
        name: '展示模式',
        description: '',
        defaultValue: LegendDisplayMode.List,
        settings: {
          options: [
            { value: LegendDisplayMode.List, label: '列表模式' },
            { value: LegendDisplayMode.Table, label: '表格模式' },
            { value: LegendDisplayMode.Hidden, label: '隐藏模式' },
          ],
        },
      })
      .addRadio({
        path: 'legend.placement',
        name: '图列放置位置',
        description: '',
        defaultValue: 'right',
        settings: {
          options: [
            { value: 'bottom', label: '底部' },
            { value: 'right', label: '右侧' },
          ],
        },
        showIf: (c) => c.legend.displayMode !== LegendDisplayMode.Hidden,
      })
      .addMultiSelect({
        name: '图列展示值',
        path: 'legend.values',
        settings: {
          options: [
            { value: PieChartLegendValues.Percent, label: 'Percent' },
            { value: PieChartLegendValues.Value, label: 'Value' },
          ],
        },
        showIf: (c) => c.legend.displayMode !== LegendDisplayMode.Hidden,
      });
  });
