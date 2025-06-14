import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Icon } from '@/components/ui/Icon';
import { Surface } from '@/components/ui/Surface';
import { Command, MenuListProps } from './types';

export const MenuList = React.forwardRef((props: MenuListProps, ref) => {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const activeItem = useRef<HTMLButtonElement>(null);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);

  // Anytime the groups change, i.e. the user types to narrow it down, we want to
  // reset the current selection to the first menu item
  useEffect(() => {
    setSelectedGroupIndex(0);
    setSelectedCommandIndex(0);
  }, [props.items]);

  const selectItem = useCallback(
    (groupIndex: number, commandIndex: number) => {
      const command = props.items[groupIndex].commands[commandIndex];
      props.command(command);
    },
    [props]
  );

  React.useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: React.KeyboardEvent }) => {
      if (event.key === 'ArrowDown') {
        if (!props.items.length) {
          return false;
        }

        const commands = props.items[selectedGroupIndex].commands;

        let newCommandIndex = selectedCommandIndex + 1;
        let newGroupIndex = selectedGroupIndex;

        if (commands.length - 1 < newCommandIndex) {
          newCommandIndex = 0;
          newGroupIndex = selectedGroupIndex + 1;
        }

        if (props.items.length - 1 < newGroupIndex) {
          newGroupIndex = 0;
        }

        setSelectedCommandIndex(newCommandIndex);
        setSelectedGroupIndex(newGroupIndex);

        return true;
      }

      if (event.key === 'ArrowUp') {
        if (!props.items.length) {
          return false;
        }

        let newCommandIndex = selectedCommandIndex - 1;
        let newGroupIndex = selectedGroupIndex;

        if (newCommandIndex < 0) {
          newGroupIndex = selectedGroupIndex - 1;
          newCommandIndex = props.items[newGroupIndex]?.commands.length - 1 || 0;
        }

        if (newGroupIndex < 0) {
          newGroupIndex = props.items.length - 1;
          newCommandIndex = props.items[newGroupIndex].commands.length - 1;
        }

        setSelectedCommandIndex(newCommandIndex);
        setSelectedGroupIndex(newGroupIndex);

        return true;
      }

      if (event.key === 'Enter') {
        if (!props.items.length || selectedGroupIndex === -1 || selectedCommandIndex === -1) {
          return false;
        }

        selectItem(selectedGroupIndex, selectedCommandIndex);

        return true;
      }

      return false;
    },
  }));

  useEffect(() => {
    if (activeItem.current && scrollContainer.current) {
      const offsetTop = activeItem.current.offsetTop;
      const offsetHeight = activeItem.current.offsetHeight;

      scrollContainer.current.scrollTop = offsetTop - offsetHeight;
    }
  }, [selectedCommandIndex, selectedGroupIndex]);

  const createCommandClickHandler = useCallback(
    (groupIndex: number, commandIndex: number) => {
      return () => {
        selectItem(groupIndex, commandIndex);
      };
    },
    [selectItem]
  );

  if (!props.items.length) {
    return null;
  }

  return (
    <Surface
      ref={scrollContainer}
      className="h-[400px] max-w-md overflow-y-auto p-4 px-2 pt-2 shadow-lg"
    >
      {props.items.map((group, groupIndex: number) => (
        <React.Fragment key={`${group.title}-wrapper`}>
          {groupIndex > 0 && <div className="mb-2 mt-2 h-px bg-gray-200" />}

          <h2 className="mb-1 text-sm font-medium text-gray-500">{group.title}</h2>
          <div className="space-y-1">
            {group.commands.map((command: Command, commandIndex: number) => (
              <button
                key={command.label}
                ref={
                  selectedGroupIndex === groupIndex && selectedCommandIndex === commandIndex
                    ? activeItem
                    : null
                }
                className={`flex w-full items-center gap-3 rounded-lg px-1 py-1 transition-colors ${
                  selectedGroupIndex === groupIndex && selectedCommandIndex === commandIndex
                    ? 'bg-gray-100'
                    : 'hover:bg-gray-50'
                }`}
                onClick={createCommandClickHandler(groupIndex, commandIndex)}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border bg-white">
                  <Icon name={command.iconName} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">{command.label}</div>
                  {command.description && (
                    <div className="text-xs text-gray-500">{command.description}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </React.Fragment>
      ))}
    </Surface>
  );
});

MenuList.displayName = 'MenuList';

export default MenuList;
