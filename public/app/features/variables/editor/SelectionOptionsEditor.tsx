import React, { ChangeEvent, FormEvent, FunctionComponent, useCallback } from 'react';
import { InlineFieldRow, VerticalGroup } from '@grafana/ui';
import { selectors } from '@grafana/e2e-selectors';

import { VariableWithMultiSupport } from '../types';
import { VariableEditorProps } from './types';
import { toVariableIdentifier, VariableIdentifier } from '../state/types';
import { VariableSectionHeader } from './VariableSectionHeader';
import { VariableSwitchField } from './VariableSwitchField';
import { VariableTextField } from './VariableTextField';

export interface SelectionOptionsEditorProps<Model extends VariableWithMultiSupport = VariableWithMultiSupport>
  extends VariableEditorProps<Model> {
  onMultiChanged: (identifier: VariableIdentifier, value: boolean) => void;
}

export const SelectionOptionsEditor: FunctionComponent<SelectionOptionsEditorProps> = (props) => {
  const onMultiChanged = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      props.onMultiChanged(toVariableIdentifier(props.variable), event.target.checked);
    },
    [props.onMultiChanged, props.variable]
  );

  const onIncludeAllChanged = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      props.onPropChange({ propName: 'includeAll', propValue: event.target.checked });
    },
    [props.onPropChange]
  );

  const onAllValueChanged = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      props.onPropChange({ propName: 'allValue', propValue: event.currentTarget.value });
    },
    [props.onPropChange]
  );
  return (
    <VerticalGroup spacing="none">
      <VariableSectionHeader name="选择方式" />
      <InlineFieldRow>
        <VariableSwitchField
          value={props.variable.multi}
          name="多选"
          tooltip="允许同时选择多个值"
          onChange={onMultiChanged}
          ariaLabel={selectors.pages.Dashboard.Settings.Variables.Edit.General.selectionOptionsMultiSwitch}
        />
      </InlineFieldRow>
      <InlineFieldRow>
        <VariableSwitchField
          value={props.variable.includeAll}
          name="全选"
          tooltip="启用包含所有变量的选项"
          onChange={onIncludeAllChanged}
          ariaLabel={selectors.pages.Dashboard.Settings.Variables.Edit.General.selectionOptionsIncludeAllSwitch}
        />
      </InlineFieldRow>
      {props.variable.includeAll && (
        <InlineFieldRow>
          <VariableTextField
            value={props.variable.allValue ?? ''}
            onChange={onAllValueChanged}
            name="Custom all value"
            placeholder="blank = auto"
            ariaLabel={selectors.pages.Dashboard.Settings.Variables.Edit.General.selectionOptionsCustomAllInput}
            labelWidth={20}
          />
        </InlineFieldRow>
      )}
    </VerticalGroup>
  );
};
SelectionOptionsEditor.displayName = 'SelectionOptionsEditor';
