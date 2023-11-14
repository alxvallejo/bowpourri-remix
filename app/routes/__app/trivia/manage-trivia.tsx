import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

export const loader = async () => {
  return null;
};

export default function ManageTrivia() {
  return <div>Test manage trivia</div>;
}
