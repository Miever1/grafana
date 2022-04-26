import React, { useState, useRef, ReactElement } from 'react';

interface LabelProps {
  Component: ReactElement;
  onClick?: () => void;
  disabled?: boolean;
}

export const useExpandableLabel = (
  initialExpanded: boolean
): [React.ComponentType<LabelProps>, number, boolean, (expanded: boolean) => void] => {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<boolean>(initialExpanded);
  const [width, setWidth] = useState(0);

  const Label: React.FC<LabelProps> = ({ Component, onClick, disabled }) => (
    <div
      ref={ref}
      onClick={
        disabled
          ? undefined
          : () => {
              setExpanded(true);
              if (ref && ref.current) {
                setWidth(ref.current.clientWidth * 1.25);
              }
              if (onClick) {
                onClick();
              }
            }
      }
    >
      {Component}
    </div>
  );

  return [Label, width, expanded, setExpanded];
};
