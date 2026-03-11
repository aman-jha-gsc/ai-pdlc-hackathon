import Game from "@/components/tic-tac-toe/Game";

export default function HomePage() {
  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
          Tic-Tac-Toe
        </h1>
        <p className="text-foreground/80 mt-2">
          Built with Next.js 14, React & Tailwind CSS
        </p>
      </header>
      <Game />
    </div>
  );
}