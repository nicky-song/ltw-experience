import { DragEndEvent, Over } from '@dnd-kit/core';
import { dndReorderList } from './utils';

describe('dnd reorder', () => {
  it('should return the list if over is equal to active', () => {
    const over = { id: 'b' } as Over;
    const active = { id: 'b' };
    const event: DragEndEvent = { over, active } as DragEndEvent;
    const list = [{ id: 'b' }, { id: 'c' }, { id: 'd' }];
    const newList = dndReorderList(event, list);
    list.forEach((item, idx) => expect(newList[idx].id).toBe(item.id));
  });

  it('should return the list if over.id is undefined', () => {
    const over = {} as Over;
    const active = { id: 'b' };
    const event: DragEndEvent = { over, active } as DragEndEvent;
    const list = [{ id: 'b' }, { id: 'c' }, { id: 'd' }];
    const newList = dndReorderList(event, list);
    list.forEach((item, idx) => expect(newList[idx].id).toBe(item.id));
  });

  it('should reorder the list if over', () => {
    const over = { id: 'b' } as Over;
    const active = { id: 'd' };
    const event: DragEndEvent = { over, active } as DragEndEvent;
    const list = [{ id: 'b' }, { id: 'c' }, { id: 'd' }];
    const newList = dndReorderList(event, list);
    expect(newList[0].id).toBe('d');
  });
});
