'use client';

import { Card, CardContent } from '@lua-case/ui-kit/ui';
import getAllDesksAction from '../app/_actions/getAllDesktsAction';

export default function Greeting({ className }: { className?: string }) {
  const onClickHandler = async () => {
    const desks = await getAllDesksAction();
  };

  return (
    <div className={className}>
      <Card>
        <CardContent>
          <p>
            {' '}
            Hallo! Herzlich Willkommen. Hier kannst du deinen Schreibtisch für
            die kommenden 30 Tage reservieren.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
