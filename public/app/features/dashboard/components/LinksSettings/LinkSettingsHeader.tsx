import React from 'react';
import { Button, Icon, HorizontalGroup } from '@grafana/ui';
import { LinkSettingsMode } from '../DashboardSettings/LinksSettings';

type LinkSettingsHeaderProps = {
  onNavClick: () => void;
  onBtnClick: () => void;
  mode: LinkSettingsMode;
  hasLinks: boolean;
};

export const LinkSettingsHeader: React.FC<LinkSettingsHeaderProps> = ({ onNavClick, onBtnClick, mode, hasLinks }) => {
  const isEditing = mode !== 'list';

  return (
    <div className="dashboard-settings__header">
      <HorizontalGroup align="center" justify="space-between">
        <h3>
          <span onClick={onNavClick} className={isEditing ? 'pointer' : ''}>
            大盘链接
          </span>
          {isEditing && (
            <span>
              <Icon name="angle-right" /> {mode === 'new' ? '新建' : '编辑'}
            </span>
          )}
        </h3>
        {!isEditing && hasLinks ? <Button onClick={onBtnClick}>新建</Button> : null}
      </HorizontalGroup>
    </div>
  );
};
