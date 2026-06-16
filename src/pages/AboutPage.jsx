function AboutPage() {
  const features = [
    {
      icon: '✓',
      title: 'Task Management',
      desc: 'Add, edit, and delete tasks seamlessly with optimistic UI updates.',
    },
    {
      icon: '⇅',
      title: 'Drag & Drop Reordering',
      desc: 'Prioritize your work by dragging tasks into any order you need.',
    },
    {
      icon: '◎',
      title: 'Filtering & Sorting',
      desc: 'Find what you need by searching, filtering by status, and sorting by date or title.',
    },
    {
      icon: '🔒',
      title: 'Secure Authentication',
      desc: 'User-specific data protected by CSRF tokens and secure session cookies.',
    },
  ];

  const stack = [
    'React 19',
    'React Router 7',
    'Vite',
    'Tailwind CSS',
    'Context API + useReducer',
    'DOMPurify',
  ];

  return (
    <div className="animate-fade-in space-y-10 py-2">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          About Taskly
        </h1>
        <p className="text-gray-500 leading-relaxed max-w-lg">
          A clean, fast task manager built to keep you organized. Every
          interaction is instant — changes appear immediately with optimistic
          updates while the server catches up in the background.
        </p>
      </div>

      <section>
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
          Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-xl border border-gray-100 p-4"
            >
              <div className="text-lg mb-2">{f.icon}</div>
              <p className="text-sm font-medium text-gray-800 mb-1">
                {f.title}
              </p>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
          Built with
        </h2>
        <div className="flex flex-wrap gap-2">
          {stack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-brand-50 text-brand-700 text-sm rounded-full border border-brand-100"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
