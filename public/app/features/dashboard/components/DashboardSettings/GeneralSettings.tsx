import React, { useState } from 'react';
// import { SelectableValue } from '@grafana/data';
import { TagsInput, Input, Field, RadioButtonGroup } from '@grafana/ui';
// import { Select, TagsInput, Input, Field, CollapsableSection, RadioButtonGroup } from '@grafana/ui';
import { selectors } from '@grafana/e2e-selectors';
import { FolderPicker } from 'app/core/components/Select/FolderPicker';
import { DashboardModel } from '../../state/DashboardModel';
import { DeleteDashboardButton } from '../DeleteDashboard/DeleteDashboardButton';
// import { TimePickerSettings } from './TimePickerSettings';

interface Props {
  dashboard: DashboardModel;
}

// const GRAPH_TOOLTIP_OPTIONS = [
//   { value: 0, label: 'Default' },
//   { value: 1, label: 'Shared crosshair' },
//   { value: 2, label: 'Shared Tooltip' },
// ];

export const GeneralSettings: React.FC<Props> = ({ dashboard }) => {
  const [renderCounter, setRenderCounter] = useState(0);

  const onFolderChange = (folder: { id: number; title: string }) => {
    dashboard.meta.folderId = folder.id;
    dashboard.meta.folderTitle = folder.title;
    dashboard.meta.hasUnsavedFolderChange = true;
  };

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    dashboard[event.currentTarget.name as 'title' | 'description'] = event.currentTarget.value;
  };

  // const onTooltipChange = (graphTooltip: SelectableValue<number>) => {
  //   dashboard.graphTooltip = graphTooltip.value;
  //   setRenderCounter(renderCounter + 1);
  // };

  // const onRefreshIntervalChange = (intervals: string[]) => {
  //   dashboard.timepicker.refresh_intervals = intervals.filter((i) => i.trim() !== '');
  // };

  // const onNowDelayChange = (nowDelay: string) => {
  //   dashboard.timepicker.nowDelay = nowDelay;
  // };

  // const onHideTimePickerChange = (hide: boolean) => {
  //   dashboard.timepicker.hidden = hide;
  //   setRenderCounter(renderCounter + 1);
  // };

  // const onTimeZoneChange = (timeZone: TimeZone) => {
  //   dashboard.timezone = timeZone;
  //   setRenderCounter(renderCounter + 1);
  // };

  const onTagsChange = (tags: string[]) => {
    dashboard.tags = tags;
    setRenderCounter(renderCounter + 1);
  };

  const onEditableChange = (value: boolean) => {
    dashboard.editable = value;
    setRenderCounter(renderCounter + 1);
  };

  const editableOptions = [
    { label: '可编辑', value: true },
    { label: '只读', value: false },
  ];

  return (
    <div style={{ maxWidth: '600px' }}>
      <h3 className="dashboard-settings__header" aria-label={selectors.pages.Dashboard.Settings.General.title}>
        基础设置
      </h3>
      <div className="gf-form-group">
        <Field label="名称">
          <Input name="title" onBlur={onBlur} defaultValue={dashboard.title} />
        </Field>
        <Field label="备注">
          <Input name="description" onBlur={onBlur} defaultValue={dashboard.description} />
        </Field>
        <Field label="标记">
          <TagsInput tags={dashboard.tags} onChange={onTagsChange} />
        </Field>
        <Field label="文件夹">
          <FolderPicker
            initialTitle={dashboard.meta.folderTitle}
            initialFolderId={dashboard.meta.folderId}
            onChange={onFolderChange}
            enableCreateNew={true}
            dashboardId={dashboard.id}
          />
        </Field>

        <Field label="可编辑" description="设置为只读以禁用所有编辑,重新加载仪表板以使更改生效">
          <RadioButtonGroup value={dashboard.editable} options={editableOptions} onChange={onEditableChange} />
        </Field>
      </div>

      {/* <TimePickerSettings
        onTimeZoneChange={onTimeZoneChange}
        onRefreshIntervalChange={onRefreshIntervalChange}
        onNowDelayChange={onNowDelayChange}
        onHideTimePickerChange={onHideTimePickerChange}
        refreshIntervals={dashboard.timepicker.refresh_intervals}
        timePickerHidden={dashboard.timepicker.hidden}
        nowDelay={dashboard.timepicker.nowDelay}
        timezone={dashboard.timezone}
      /> */}

      {/* <CollapsableSection label="Panel options" isOpen={true}>
        <Field
          label="Graph tooltip"
          description="Controls tooltip and hover highlight behavior across different panels"
        >
          <Select
            onChange={onTooltipChange}
            options={GRAPH_TOOLTIP_OPTIONS}
            width={40}
            value={dashboard.graphTooltip}
          />
        </Field>
      </CollapsableSection> */}

      <div className="gf-form-button-row">
        {dashboard.meta.canSave && <DeleteDashboardButton dashboard={dashboard} />}
      </div>
    </div>
  );
};
