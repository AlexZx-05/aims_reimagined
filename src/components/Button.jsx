export default function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg bg-blue-800 text-white font-medium hover:bg-blue-700 transition ${className}`}
    >
      {children}
    </button>
  );
}
