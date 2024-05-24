interface CardProps {
  points: number;
  onClick?(): void;
}

export default function Card({ points, onClick }: CardProps) {
  return (
    <div
      className="border-zinc-300 border-2 rounded-sm text-white cursor-pointer hover:bg-zinc-800 w-24 h-32 flex items-center justify-center"
      onClick={onClick}
    >
      {points}
    </div>
  );
}
