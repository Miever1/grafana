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
        name: '饼图类型',
        description: '应该如何呈现饼图',
        path: 'pieType',
        settings: {
          options: [
            { value: PieChartType.Pie, label: '饼状' },
            { value: PieChartType.Donut, label: '环状' },
          ],
        },
        defaultValue: PieChartType.Pie,
      })
      .addMultiSelect({
        name: '标签',
        path: 'displayLabels',
        description: '选择要在饼图中显示的标签',
        settings: {
          options: [
            { value: PieChartLabels.Percent, label: '百分比' },
            { value: PieChartLabels.Name, label: '图例名' },
            { value: PieChartLabels.Value, label: '数值' },
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
            { value: PieChartLegendValues.Percent, label: '百分比' },
            { value: PieChartLegendValues.Value, label: '值' },
          ],
        },
        showIf: (c) => c.legend.displayMode !== LegendDisplayMode.Hidden,
      });
  });
