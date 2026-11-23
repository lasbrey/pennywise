export const SUPPORT_ADMIN_EMAIL = "aloyelaz@gmail.com";
export const SUPPORT_ADMIN_ID = "e6207bca-efb4-495d-870c-8202064db3b4";

export function isSupportAdmin(
  user?: { id?: string | null; email?: string | null; username?: string | null } | null
): boolean {
  if (!user) return false;
  const email = user.email?.toLowerCase().trim();
  const username = user.username?.toLowerCase().trim();
  return (
    user.id === SUPPORT_ADMIN_ID ||
    email === SUPPORT_ADMIN_EMAIL ||
    username === SUPPORT_ADMIN_EMAIL
  );
}
