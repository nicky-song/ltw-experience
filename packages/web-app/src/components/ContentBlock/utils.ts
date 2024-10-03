import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

interface ListItem {
  id: string;
}
export function dndReorderList<T extends ListItem>(
  event: DragEndEvent,
  list: Array<T>,
): Array<T> {
  const { active, over } = event;
  if (!over?.id || active.id === over?.id) {
    return list;
  }
  const oldIndex = list.findIndex((listItem) => listItem.id === active.id);
  const newIndex = list.findIndex((listItem) => listItem.id === over.id);
  return arrayMove(list, oldIndex, newIndex);
}
