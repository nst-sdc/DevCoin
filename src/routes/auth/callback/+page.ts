import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
  // After successful sign in, redirect to the home page
  // You can modify this to redirect to any other page as needed
  throw redirect(303, '/');
};
