// Main Screen Text
export function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 text-white">
      <h1 className="font-pixel text-7xl mb-6">Welcome to Cozy Dev{" "}
        <img
          src="/images/moon.png"
          alt="Moon icon"
          width={128}
          height={128}
          className="inline-block ml-2 align-middle"
        />
      </h1>
      <p className="bg-[#6ab4da] rounded-lg font-pixel mb-12 text-lg p-1">
        Where your ideas, projects, and creativity are yours.
      </p>
      </div>
  );
}
