'use client';

import { Button } from '@lua-case/ui-kit/ui';
import signOutAction from '../app/_actions/signOutAction';

export default function LogoutButton() {
  return (
    <Button
      onClick={() => {
        signOutAction();
      }}
    >
      Logout
    </Button>
  );
}
