import type { Tile as TileModel } from '@/types/game';

const COLORS: Record<number, string> = {
  2: 'var(--t2)',
  4: 'var(--t4)',
  8: 'var(--t8)',
  16: 'var(--t16)',
  32: 'var(--t32)',
  64: 'var(--t64)',
  128: 'var(--t128)',
  256: 'var(--t256)',
  512: 'var(--t512)',
  1024: 'var(--t1024)',
  2048: 'var(--t2048)',
};

function colorFor(value: number) {
  return COLORS[value] ?? 'var(--tbig)';
}

function fontSizeFor(value: number, size: number) {
  const digits = String(value).length;
  const base = size === 4 ? 2.1 : size === 5 ? 1.7 : 1.4;
  const scale = digits >= 4 ? 0.62 : digits === 3 ? 0.78 : 1;
  return `${(base * scale).toFixed(2)}rem`;
}

interface Props {
  tile: TileModel;
  size: number;
  gapPct: number;
  selectable: boolean;
  selected: boolean;
  onSelect: (id: number) => void;
}

export default function Tile({ tile, size, gapPct, selectable, selected, onSelect }: Props) {
  const cellPct = (100 - gapPct * (size + 1)) / size;
  const left = gapPct + tile.col * (cellPct + gapPct);
  const top = gapPct + tile.row * (cellPct + gapPct);
  const color = colorFor(tile.value);

  const animation = tile.merged ? 'anim-merge' : tile.isNew ? 'anim-pop' : '';

  return (
    <button
      type="button"
      disabled={!selectable}
      onClick={() => onSelect(tile.id)}
      aria-label={`Tile ${tile.value}`}
      className={`absolute grid place-items-center rounded-xl font-black tabular-nums transition-[left,top] duration-[110ms] ease-out ${animation} ${
        selectable ? 'cursor-pointer' : 'cursor-default'
      } focus:outline-none`}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${cellPct}%`,
        height: `${cellPct}%`,
        background: `linear-gradient(150deg, color-mix(in srgb, ${color} 92%, white 8%), color-mix(in srgb, ${color} 70%, black 30%))`,
        color: '#f6fdff',
        fontSize: fontSizeFor(tile.value, size),
        boxShadow: selected
          ? `0 0 0 3px var(--accent), 0 0 26px color-mix(in srgb, ${color} 70%, transparent)`
          : `inset 0 1px 0 rgba(255,255,255,0.25), 0 0 ${Math.min(
              10 + Math.log2(tile.value) * 4,
              44,
            )}px color-mix(in srgb, ${color} 65%, transparent)`,
        textShadow: '0 1px 6px rgba(0,0,0,0.45)',
      }}
    >
      {tile.value}
    </button>
  );
}
