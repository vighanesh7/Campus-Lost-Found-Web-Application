import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addFavorite, removeFavorite } from '../redux/favoriteSlice';
import { useToast } from '../context/ToastContext';

// Shared favourite/view handlers so every page using <ItemCard> behaves identically.
export default function useItemActions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const favoriteIds = useSelector((s) => s.favorites.ids);
  const toggleFavorite = useCallback(async (item) => {
    const isFav = favoriteIds.includes(item.id);
    const res = await dispatch(isFav ? removeFavorite(item.id) : addFavorite(item.id));
    if (res.error) toast.error(res.payload?.message || 'Could not update favourites');
    else toast.success(isFav ? 'Removed from favourites' : 'Saved to favourites');
  }, [dispatch, favoriteIds, toast]);
  const viewItem = useCallback((id) => navigate(`/items/${id}`), [navigate]);
  return { favoriteIds, toggleFavorite, viewItem };
}
