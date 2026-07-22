import { ShoppingCart, Star, AlertCircle, IndianRupee } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import FollowUpPrompts from './FollowUpPrompts';

/* ── Inline product card shown inside AI responses ──────────────────────── */
const ProductCard = ({ product, onAddToCart }) => {
  if (!product) return null;
  const { _id, name, price, images, rating, category, reasons = [] } = product;
  const imageUrl = images?.[0] || null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:border-purple-500/40 transition-colors">
      {/* Image */}
      {imageUrl && (
        <div className="h-28 bg-white/5 flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-contain p-2"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-3 space-y-2">
        {/* Category badge */}
        {category && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20">
            {category}
          </span>
        )}

        {/* Name */}
        <p className="text-xs font-semibold text-white leading-tight line-clamp-2">{name}</p>

        {/* Price + rating row */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-0.5 text-sm font-bold text-white">
            <IndianRupee className="w-3 h-3" />
            {price?.toLocaleString('en-IN')}
          </span>
          {rating != null && (
            <span className="flex items-center gap-1 text-[11px] text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              {Number(rating).toFixed(1)}
            </span>
          )}
        </div>

        {/* Recommendation reasons */}
        {reasons.length > 0 && (
          <ul className="space-y-0.5">
            {reasons.slice(0, 2).map((r, i) => (
              <li key={i} className="flex items-start gap-1 text-[10px] text-white/60">
                <span className="text-purple-400 mt-px">•</span>
                {r}
              </li>
            ))}
          </ul>
        )}

        {/* Add to cart */}
        {_id && (
          <button
            onClick={() => onAddToCart(_id)}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg
                       bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-medium
                       transition-colors"
          >
            <ShoppingCart className="w-3 h-3" />
            Add to Cart
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
      <div className="flex justify-end px-4">
        <div className="max-w-[80%] space-y-1">
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white text-sm
                          px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-md">
            {content}
          </div>
          <p className="text-[10px] text-white/30 text-right pr-1">{timeStr}</p>
        </div>
      </div>
    );
  }

  /* ── Error bubble ────────────────────────────────────────────────────── */
  if (isError) {
    return (
      <div className="flex items-start gap-3 px-4">
        <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-1">
          <AlertCircle className="w-4 h-4 text-red-400" />
        </div>
        <div className="max-w-[85%] bg-red-500/10 border border-red-500/20 text-red-300
                        text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm">
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
      {/* Avatar + text bubble */}
      <div className="flex items-start gap-3 px-4">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500
                        flex items-center justify-center shrink-0 mt-1">
          <span className="text-white text-[10px] font-bold">AI</span>
        </div>

        <div className="max-w-[85%] space-y-1">
          <div className="bg-white/8 border border-white/10 text-white/90 text-sm
                          px-4 py-2.5 rounded-2xl rounded-tl-sm leading-relaxed">
            {content}
          </div>
          <p className="text-[10px] text-white/30 pl-1">{timeStr}</p>
        </div>
      </div>

      {/* Product cards grid */}
      {products.length > 0 && (
        <div className="px-4 pl-14">
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
        <div className="pl-10">
          <FollowUpPrompts suggestions={followUpSuggestions} onSelect={onFollowUp} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
