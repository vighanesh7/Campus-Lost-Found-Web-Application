import { useEffect, useReducer, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import FormField from '../components/forms/FormField';
import Icon from '../components/common/Icon';
import useCategories from '../hooks/useCategories';
import { createItem } from '../redux/itemSlice';
import { useToast } from '../context/ToastContext';
import { LOCATION_SUGGESTIONS } from '../utils/constants';
import { fieldErrors } from '../utils/errors';
import { localISO } from '../utils/format';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
const initial = (type) => ({ type, name: '', categoryId: '', description: '', location: '', date: localISO(), time: '', contactPreference: 'MESSAGE', additionalDetails: '', file: null, preview: null, errors: {}, submitting: false });

// useReducer: one place describes every way the (large) form state can change.
function reducer(state, a) {
  switch (a.kind) {
    case 'field': return { ...state, [a.name]: a.value, errors: { ...state.errors, [a.name]: undefined } };
    case 'file': return { ...state, file: a.file, preview: a.preview, errors: { ...state.errors, image: undefined } };
    case 'errors': return { ...state, errors: a.errors, submitting: false };
    case 'submitting': return { ...state, submitting: a.value };
    default: return state;
  }
}
function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Item name is required';
  if (!f.categoryId) e.categoryId = 'Select a category';
  if (f.description.trim().length < 10) e.description = 'Describe the item (at least 10 characters)';
  if (!f.location.trim()) e.location = 'Location is required';
  if (!f.date || new Date(f.date) > new Date()) e.date = 'Enter a valid date (not in the future)';
  return e;
}

export default function ReportItem() {
  const [params] = useSearchParams();
  const startType = params.get('type') === 'FOUND' ? 'FOUND' : 'LOST';
  const [state, dispatchForm] = useReducer(reducer, startType, initial);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { categories } = useCategories();
  const fileRef = useRef(null);
  const firstErrorRef = useRef(null);
  const { errors } = state;

  useEffect(() => () => { if (state.preview) URL.revokeObjectURL(state.preview); }, [state.preview]);
  useEffect(() => { firstErrorRef.current?.focus(); }, [errors]);

  const set = (name) => (e) => dispatchForm({ kind: 'field', name, value: e.target.value });
  const pickFile = (file) => {
    if (!file) return;
    if (!ALLOWED.includes(file.type)) return dispatchForm({ kind: 'errors', errors: { ...errors, image: 'Only JPG, PNG or WEBP images are allowed' } });
    if (file.size > 5 * 1024 * 1024) return dispatchForm({ kind: 'errors', errors: { ...errors, image: 'Image must be 5MB or smaller' } });
    dispatchForm({ kind: 'file', file, preview: URL.createObjectURL(file) });
  };
  const submit = async (e) => {
    e.preventDefault();
    const v = validate(state);
    if (Object.keys(v).length) return dispatchForm({ kind: 'errors', errors: v });
    const fd = new FormData();
    ['type', 'name', 'categoryId', 'description', 'location', 'date', 'time', 'contactPreference', 'additionalDetails'].forEach((k) => state[k] && fd.append(k, state[k]));
    if (state.file) fd.append('image', state.file);
    dispatchForm({ kind: 'submitting', value: true });
    const res = await dispatch(createItem(fd));
    if (res.error) {
      const fe = fieldErrors(res.payload);
      if (!Object.keys(fe).length) fe.image = undefined;
      dispatchForm({ kind: 'errors', errors: fe });
      toast.error(res.payload?.message || 'Could not submit report');
    } else {
      toast.success('Report submitted successfully');
      navigate(`/items/${res.payload.id}`);
    }
  };
  const errField = Object.keys(errors).find((k) => errors[k]);
  const ref = (name) => (name === errField ? firstErrorRef : undefined);

  return (
    <section className="narrow">
      <h1 className="page-title">Report an Item</h1>
      <p className="muted">What would you like to report?</p>
      <form onSubmit={submit} noValidate>
        <div className="type-switch" role="radiogroup" aria-label="Report type">
          <button type="button" role="radio" aria-checked={state.type === 'LOST'} className={`type-card lost ${state.type === 'LOST' ? 'on' : ''}`} onClick={() => dispatchForm({ kind: 'field', name: 'type', value: 'LOST' })}>
            <Icon name="bag" size={26} /><b>Lost Items</b><small>Report a missing post</small></button>
          <button type="button" role="radio" aria-checked={state.type === 'FOUND'} className={`type-card found ${state.type === 'FOUND' ? 'on' : ''}`} onClick={() => dispatchForm({ kind: 'field', name: 'type', value: 'FOUND' })}>
            <Icon name="check" size={26} /><b>Found Items</b><small>Report a found post</small></button>
        </div>

        <div className="form-grid">
          <FormField id="name" label="Item name" required error={errors.name}>
            <input id="name" ref={ref('name')} value={state.name} onChange={set('name')} placeholder="eg: Black backpack" maxLength={120} aria-invalid={!!errors.name} />
          </FormField>
          <FormField id="categoryId" label="Category" required error={errors.categoryId}>
            <select id="categoryId" ref={ref('categoryId')} value={state.categoryId} onChange={set('categoryId')} aria-invalid={!!errors.categoryId}>
              <option value="">Select category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FormField>
        </div>
        <FormField id="description" label="Description" required error={errors.description}>
          <textarea id="description" ref={ref('description')} rows={4} value={state.description} onChange={set('description')} placeholder="Describe the item in detail..." maxLength={2000} aria-invalid={!!errors.description} />
        </FormField>
        <div className="form-grid">
          <FormField id="location" label={state.type === 'LOST' ? 'Where did you lose it?' : 'Where did you find it?'} required error={errors.location}>
            <input id="location" ref={ref('location')} list="loc-list" value={state.location} onChange={set('location')} placeholder="Select or type a location" aria-invalid={!!errors.location} />
            <datalist id="loc-list">{LOCATION_SUGGESTIONS.map((l) => <option key={l} value={l} />)}</datalist>
          </FormField>
          <FormField id="date" label="Date" required error={errors.date}>
            <input id="date" ref={ref('date')} type="date" max={localISO()} value={state.date} onChange={set('date')} aria-invalid={!!errors.date} />
          </FormField>
          <FormField id="time" label="Time (optional)" error={errors.time}><input id="time" type="time" value={state.time} onChange={set('time')} /></FormField>
          <FormField id="contactPreference" label="Contact preference">
            <select id="contactPreference" value={state.contactPreference} onChange={set('contactPreference')}>
              <option value="MESSAGE">In-app message</option><option value="EMAIL">Email</option><option value="PHONE">Phone</option>
            </select>
          </FormField>
        </div>
        <FormField id="additionalDetails" label="Additional details (optional)" error={errors.additionalDetails}>
          <textarea id="additionalDetails" rows={2} value={state.additionalDetails} onChange={set('additionalDetails')} placeholder="Marks, serial number, who to ask..." maxLength={1000} />
        </FormField>

        <FormField id="image" label="Upload image" error={errors.image}>
          <div className="dropzone" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); pickFile(e.dataTransfer.files[0]); }}>
            {state.preview ? <img src={state.preview} alt="Selected item preview" /> : <><Icon name="upload" size={26} /><span>Tap to upload or drag and drop<br /><small>PNG, JPG or WEBP up to 5MB</small></span></>}
            <input id="image" ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => pickFile(e.target.files[0])} />
          </div>
          {state.file && <button type="button" className="link-btn" onClick={() => { dispatchForm({ kind: 'file', file: null, preview: null }); if (fileRef.current) fileRef.current.value = ''; }}>Remove image</button>}
        </FormField>
        <button className="btn btn-primary btn-block" disabled={state.submitting}>{state.submitting ? 'Submitting...' : 'Submit the Report'}</button>
      </form>
    </section>
  );
}
