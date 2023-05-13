import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, NavLink, Outlet, useLoaderData } from '@remix-run/react';

import { requireUserId } from '~/session.server';
import { useUser } from '~/utils';

export async function loader({ request }: LoaderArgs) {
  return json({});
}

export default function Main() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <>
      <Outlet />
    </>
  );
}
