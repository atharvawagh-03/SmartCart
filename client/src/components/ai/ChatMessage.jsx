import { ShoppingCart, Star, AlertCircle, IndianRupee } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import FollowUpPrompts from './FollowUpPrompts';

/* ── Inline product card shown inside AI responses ──────────────────────── */
const ProductCard = ({ product, onAddToCart }) => {
  if (!product) return null;
  const { _id, name, price, images, rating, category, reasons = [] } = product;
  const imageUrl = images?.[0] || null;

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-zinc-700 transition-colors">
      {/* Image */}
      {imageUrl && (
        <div className="h-24 bg-zinc-950 flex items-center justify-center overflow-hidden border-b border-zinc-800">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-contain p-2"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-2.5 space-y-1.5">
        {category && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
            {category}
          </span>
        )}

        <p className="text-xs font-medium text-white leading-snug line-clamp-2">{name}</p>

        <div className="flex items-center justify-between text-xs pt-0.5">
          <span className="font-semibold text-white tabular-nums">
            ₹{price?.toLocaleString('en-IN')}
          </span>
          {rating != null && (
            <span className="flex items-center gap-0.5 text-[10px] text-amber-400">
              <Star className="w-2.5 h-2.5 fill-amber-400" />
              {Number(rating).toFixed(1)}
            </span>
          )}
        </div>

        {reasons.length > 0 && (
          <ul className="space-y-0.5 pt-0.5">
            {reasons.slice(0, 2).map((r, i) => (
              <li key={i} className="text-[10px] text-zinc-400 line-clamp-1">
                • {r}
              </li>
            ))}
          </ul>
        )}

        {_id && (
          <button
            onClick={() => onAddToCart(_id)}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-medium transition-colors mt-1"
          >
            <ShoppingCart className="w-3 h-3 text-zinc-400" />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </div>
  );
};

/* ── Main message bubble ─────────────────────────────────────────────────── */
const ChatMessage = ({ message, onFollowUp }) => {
  const { addToCart } = useCart();

  const { role, content, contentType, structuredData, timestamp } = message;
  const isUser = role === 'user';
  const isError = contentType === 'error';

  const timeStr = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1);
  };

  /* ── User bubble ─────────────────────────────────────────────────────── */
  if (isUser) {
    return (
      <div className="flex justify-end px-3">
        <div className="max-w-[85%] space-y-0.5">
          <div className="bg-blue-600 text-white text-xs px-3 py-2 rounded-lg rounded-tr-xs leading-relaxed">
            {content}
          </div>
          <p className="text-[9px] text-zinc-500 text-right pr-0.5">{timeStr}</p>
        </div>
      </div>
    );
  }

  /* ── Error bubble ────────────────────────────────────────────────────── */
  if (isError) {
    return (
      <div className="flex items-start gap-2.5 px-3">
        <div className="w-6 h-6 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
        </div>
        <div className="max-w-[85%] bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs px-3 py-2 rounded-lg leading-relaxed">
          {content}
        </div>
      </div>
    );
  }

  /* ── Assistant bubble ────────────────────────────────────────────────── */
  const products = structuredData?.products || [];
  const followUpSuggestions = structuredData?.followUpSuggestions || [];

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2.5 px-3">
        <div className="w-6 h-6 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-zinc-300 text-[10px] font-semibold">SC</span>
        </div>

        <div className="max-w-[88%] space-y-0.5">
          <div className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs px-3 py-2 rounded-lg rounded-tl-xs leading-relaxed">
            {content}
          </div>
          <p className="text-[9px] text-zinc-500 pl-0.5">{timeStr}</p>
        </div>
      </div>

      {/* Product cards grid */}
      {products.length > 0 && (
        <div className="px-3 pl-11">
          <div className="grid grid-cols-2 gap-2">
            {products.map((product, i) => (
              <ProductCard
                key={product._id || i}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      )}

      {/* Follow-up suggestion chips */}
      {followUpSuggestions.length > 0 && (
        <div className="pl-9">
          <FollowUpPrompts suggestions={followUpSuggestions} onSelect={onFollowUp} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
