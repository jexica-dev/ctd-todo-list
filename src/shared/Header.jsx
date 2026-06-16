import Navigation from './Navigation';

function Header() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="text-2xl tracking-wide font-bold text-gray-900 tracking-tight">
          Taskly
        </span>
        <Navigation />
      </div>
    </header>
  );
}

export default Header;
