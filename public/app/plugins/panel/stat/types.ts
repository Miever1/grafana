import {
  SingleStatBaseOptions,
  BigValueColorMode,
  BigValueGraphMode,
  BigValueJustifyMode,
  BigValueTextMode,
} from '@grafana/ui';
import {
  ReducerID,
  standardEditorsRegistry,
  FieldOverrideContext,
  getFieldDisplayName,
  escapeStringForRegex,
  VizOrientation,
  PanelOptionsEditorBuilder,
} from '@grafana/data';

// Structure copied from angular
export interface StatPanelOptions extends SingleStatBaseOptions {
  graphMode: BigValueGraphMode;
  colorMode: BigValueColorMode;
  justifyMode: BigValueJustifyMode;
  textMode: BigValueTextMode;
}

export function addStandardDataReduceOptions<T extends SingleStatBaseOptions>(
  builder: PanelOptionsEditorBuilder<T>,
  includeOrientation = true,
  includeFieldMatcher = true,
  includeTextSizes = true
) {
  builder.addRadio({
    path: 'reduceOptions.values',
    name: '显示值',
    description: '计算每列或每列的单个值或显示每一行',
    settings: {
      options: [
        { value: false, label: '计算值' },
        { value: true, label: '所有值' },
      ],
    },
    defaultValue: false,
  });

  builder.addNumberInput({
    path: 'reduceOptions.limit',
    name: 'Limit',
    description: 'Max number of rows to display',
    settings: {
      placeholder: '5000',
      integer: true,
      min: 1,
      max: 5000,
    },
    showIf: (options) => options.reduceOptions.values === true,
  });

  builder.addCustomEditor({
    id: 'reduceOptions.calcs',
    path: 'reduceOptions.calcs',
    name: '计算类型',
    description: '选择一种计算值',
    editor: standardEditorsRegistry.get('stats-picker').editor as any,
    defaultValue: [ReducerID.lastNotNull],
    // Hides it when all values mode is on
    showIf: (currentConfig) => currentConfig.reduceOptions.values === false,
  });

  if (includeFieldMatcher) {
    builder.addSelect({
      path: 'reduceOptions.fields',
      name: '字段',
      description: '选择应包含在面板中的字段',
      settings: {
        allowCustomValue: true,
        options: [],
        getOptions: async (context: FieldOverrideContext) => {
          const options = [
            { value: '', label: '数值' },
            { value: '/.*/', label: '所有字段' },
          ];
          if (context && context.data) {
            for (const frame of context.data) {
              for (const field of frame.fields) {
                const name = getFieldDisplayName(field, frame, context.data);
                const label = name === 'time' ? '时间' : name;
                const value = `/^${escapeStringForRegex(name)}$/`;
                options.push({ value, label });
              }
            }
          }
          return Promise.resolve(options);
        },
      },
      defaultValue: '',
    });
  }

  if (includeOrientation) {
    builder.addRadio({
      path: 'orientation',
      name: '方向',
      description: '多个系列或字段的堆叠方向',
      settings: {
        options: [
          { value: VizOrientation.Auto, label: '自适应' },
          { value: VizOrientation.Horizontal, label: '水平' },
          { value: VizOrientation.Vertical, label: '垂直' },
        ],
      },
      defaultValue: VizOrientation.Auto,
    });
  }

  if (includeTextSizes) {
    // builder.addNumberInput({
    //   path: 'text.titleSize',
    //   category: ['Text size'],
    //   name: 'Title',
    //   settings: {
    //     placeholder: 'Auto',
    //     integer: false,
    //     min: 1,
    //     max: 200,
    //   },
    //   defaultValue: undefined,
    // });
    // builder.addNumberInput({
    //   path: 'text.valueSize',
    //   category: ['Text size'],
    //   name: 'Value',
    //   settings: {
    //     placeholder: 'Auto',
    //     integer: false,
    //     min: 1,
    //     max: 200,
    //   },
    //   defaultValue: undefined,
    // });
  }
}
