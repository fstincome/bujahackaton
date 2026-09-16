// Registration deadline: Sunday, September 20, 2026 at 23:59 (Bujumbura, UTC+2)
export const REGISTRATION_DEADLINE = new Date("2026-09-20T23:59:59+02:00");

export function isRegistrationClosed(now: Date = new Date()) {
  return now.getTime() > REGISTRATION_DEADLINE.getTime();
}
