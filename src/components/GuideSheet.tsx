import { Sheet } from '@heroui-pro/react';
import type { ReactNode } from 'react';
export function GuideSheet({ title, open, onOpenChange, children }: { title: string; open: boolean; onOpenChange: (open: boolean) => void; children: ReactNode }) {
  return <Sheet isOpen={open} onOpenChange={onOpenChange} isHandleOnly placement="bottom"><Sheet.Backdrop variant="opaque"><Sheet.Content className="guide-sheet"><Sheet.Dialog>
    <Sheet.Handle /><Sheet.CloseTrigger aria-label={`Close ${title.toLowerCase()}`} />
    <Sheet.Header><Sheet.Heading>{title}</Sheet.Heading></Sheet.Header>
    <Sheet.Body>{children}</Sheet.Body>
  </Sheet.Dialog></Sheet.Content></Sheet.Backdrop></Sheet>;
}
