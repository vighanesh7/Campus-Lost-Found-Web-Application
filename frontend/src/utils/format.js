import { FILE_URL } from '../services/api';

export const imageUrl = (path) => (path ? `${FILE_URL}${path}` : null);
export const localISO = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function timeAgo(value) {
  const diff = Date.now() - new Date(value).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'Just now';
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const day = Math.floor(hr / 24);
  return day === 1 ? '1 day ago' : `${day} days ago`;
}
export const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
// "Date" filter dropdown -> API query params
export function rangeToParams(range) {
  const daysAgo = (n) => localISO(new Date(Date.now() - n * 864e5));
  if (range === 'today') return { date: localISO() };
  if (range === 'week') return { dateFrom: daysAgo(7) };
  if (range === 'month') return { dateFrom: daysAgo(30) };
  return {};
}
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
