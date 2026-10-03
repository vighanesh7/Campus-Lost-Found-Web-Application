// Turns any Axios error into { message, errors, status } with user-friendly text.
export function getErrorInfo(err) {
  if (!err.response) {
    return { message: err.code === 'ECONNABORTED' ? 'The request timed out. Please try again.' : 'Cannot reach the server. Check that the backend is running.', errors: [] };
  }
  const data = err.response.data || {};
  return { message: data.message || 'Something went wrong', errors: data.errors || [], status: err.response.status };
}
export const getErrorMessage = (err) => getErrorInfo(err).message;
export const fieldErrors = (info) => Object.fromEntries((info?.errors || []).map((e) => [e.field, e.message]));
