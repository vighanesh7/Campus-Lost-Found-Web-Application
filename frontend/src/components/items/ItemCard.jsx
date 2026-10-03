import { memo } from 'react';
import Icon from '../common/Icon';
import ItemStatusBadge, { TypeBadge } from './ItemStatusBadge';
import { imageUrl, timeAgo } from '../../utils/format';

// One card used by Home, Search, Lost, Found, Favourites and My Items.
function ItemCard({ item, isFavorite = false, onFavorite, onView }) {
  const src = imageUrl(item.image || item.images?.[0]?.imagePath);
  return (
    <article className="item-card">
      <button type="button" className="item-card-main" onClick={() => onView(item.id)} aria-label={`View ${item.name}`}>
        <div className="item-thumb">
          {src ? <img src={src} alt={item.name} loading="lazy" /> : <span className="thumb-fallback"><Icon name="bag" size={36} /></span>}
          <TypeBadge type={item.type} />
        </div>
        <div className="item-body">
          <h3>{item.name}</h3>
          <p className="item-meta"><Icon name="pin" size={13} />{item.location}</p>
          <p className="item-desc">{item.description}</p>
          <div className="item-foot"><span>{timeAgo(item.createdAt)}</span><ItemStatusBadge status={item.status} /></div>
        </div>
      </button>
      {onFavorite && (
        <button type="button" className={`fav-btn ${isFavorite ? 'on' : ''}`} aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remove ${item.name} from favourites` : `Save ${item.name} to favourites`} onClick={() => onFavorite(item)}>
          <Icon name="heart" size={16} />
        </button>
      )}
    </article>
  );
}
export default memo(ItemCard);
