import React, { useState } from 'react';
import { css } from 'emotion';
import { CollapsableSection, Button, TagsInput, Select, Field, Input, Checkbox } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import { LinkSettingsMode } from '../DashboardSettings/LinksSettings';
import { DashboardLink, DashboardModel } from '../../state/DashboardModel';

const newLink = {
  icon: 'external link',
  title: '',
  tooltip: '',
  type: 'dashboards',
  url: '',
  asDropdown: false,
  tags: [],
  targetBlank: false,
  keepTime: false,
  includeVars: false,
} as DashboardLink;

const linkTypeOptions = [
  { value: 'dashboards', label: '大盘列表' },
  { value: 'link', label: '链接' },
];

export const linkIconMap: { [key: string]: string } = {
  'external link': 'external-link-alt',
  dashboard: 'apps',
  question: 'question-circle',
  info: 'info-circle',
  bolt: 'bolt',
  doc: 'file-alt',
  cloud: 'cloud',
};

const linkIconOptions = Object.keys(linkIconMap).map((key) => ({ label: key, value: key }));

type LinkSettingsEditProps = {
  mode: LinkSettingsMode;
  editLinkIdx: number | null;
  dashboard: DashboardModel;
  backToList: () => void;
};

export const LinkSettingsEdit: React.FC<LinkSettingsEditProps> = ({ mode, editLinkIdx, dashboard, backToList }) => {
  const [linkSettings, setLinkSettings] = useState(editLinkIdx !== null ? dashboard.links[editLinkIdx] : newLink);

  const onTagsChange = (tags: any[]) => {
    setLinkSettings((link) => ({ ...link, tags: tags }));
  };

  const onTypeChange = (selectedItem: SelectableValue) => {
    setLinkSettings((link) => ({ ...link, type: selectedItem.value }));
  };

  const onIconChange = (selectedItem: SelectableValue) => {
    setLinkSettings((link) => ({ ...link, icon: selectedItem.value }));
  };

  const onChange = (ev: React.FocusEvent<HTMLInputElement>) => {
    const target = ev.currentTarget;
    setLinkSettings((link) => ({
      ...link,
      [target.name]: target.type === 'checkbox' ? target.checked : target.value,
    }));
  };

  const addLink = () => {
    dashboard.links = [...dashboard.links, linkSettings];
    dashboard.updateSubmenuVisibility();
    backToList();
  };

  const updateLink = () => {
    dashboard.links.splice(editLinkIdx!, 1, linkSettings);
    dashboard.updateSubmenuVisibility();
    backToList();
  };

  return (
    <div
      className={css`
        max-width: 600px;
      `}
    >
      <Field label="链接类型">
        <Select value={linkSettings.type} options={linkTypeOptions} onChange={onTypeChange} />
      </Field>
      <Field label="链接显示名称">
        <Input name="title" aria-label="title" value={linkSettings.title} onChange={onChange} />
      </Field>
      {linkSettings.type === 'dashboards' && (
        <>
          <Field label="添加标记">
            <TagsInput tags={linkSettings.tags} placeholder="add tags" onChange={onTagsChange} />
          </Field>
        </>
      )}
      {linkSettings.type === 'link' && (
        <>
          <Field label="Url链接">
            <Input name="url" value={linkSettings.url} onChange={onChange} />
          </Field>
          <Field label="链接提示">
            <Input name="tooltip" value={linkSettings.tooltip} onChange={onChange} placeholder="Open dashboard" />
          </Field>
          <Field label="选择图标">
            <Select value={linkSettings.icon} options={linkIconOptions} onChange={onIconChange} />
          </Field>
        </>
      )}
      <CollapsableSection label="展示选项" isOpen={true}>
        {linkSettings.type === 'dashboards' && (
          <Field>
            <Checkbox label="显示为下拉菜单" name="asDropdown" value={linkSettings.asDropdown} onChange={onChange} />
          </Field>
        )}
        <Field>
          <Checkbox label="包括当前时间范围" name="keepTime" value={linkSettings.keepTime} onChange={onChange} />
        </Field>
        <Field>
          <Checkbox
            label="包括当前模板变量值"
            name="includeVars"
            value={linkSettings.includeVars}
            onChange={onChange}
          />
        </Field>
        <Field>
          <Checkbox
            label="在新的web页打开链接"
            name="targetBlank"
            value={linkSettings.targetBlank}
            onChange={onChange}
          />
        </Field>
      </CollapsableSection>

      <div className="gf-form-button-row">
        {mode === 'new' && <Button onClick={addLink}>新建</Button>}
        {mode === 'edit' && <Button onClick={updateLink}>更新</Button>}
      </div>
    </div>
  );
};
