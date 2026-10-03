import { useSearchParams } from 'react-router-dom';
import ItemBrowser from '../components/items/ItemBrowser';
export default function SearchItems() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  return <ItemBrowser key={q} title="Search Items" initialSearch={q} />;
}
