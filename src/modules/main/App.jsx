/* @flow */

import React from 'react';
import { TopBar } from '../topBar/TopBar';
import { SaveStatus } from '../saveStatus/constants';
import { AppBottomContainerStyle, AppStyle } from './styles';
import { ComponentsPanel } from '../leftPanel/ComponentsPanel';
import { Workspace } from '../workspace/Workspace';

export const App = () => (
  <div style={AppStyle}>
    <TopBar saveStatus={SaveStatus.SAVED} />
    <div style={AppBottomContainerStyle}>
      <ComponentsPanel />
      <Workspace />
    </div>
  </div>
);

