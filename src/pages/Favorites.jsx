import { useState, useEffect } from "react";
import AppLayout from "../layouts/AppLayout";
import favoritesData from "../data/favorites";

export default function Favorites() {
  const [favorites, setFavorites] = useState(() => {
    // Load from localStorage or fallback to default
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : favoritesData;
  });

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const removeFavorite = (type, id) => {
    setFavorites({
      ...favorites,
      [type]: favorites[type].filter((item) => item.id !== id),
    });
  };

  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold mb-6">Favorites</h1>

      <div className="space-y-8">
        {/* Courses */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Favorite Courses</h2>

          <div className="space-y-3">
            {favorites.courses.length === 0 && (
              <p className="text-gray-500">No favorite courses.</p>
            )}
            {favorites.courses.map((course) => (
              <div
                key={course.id}
                className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm"
              >
                <span className="font-medium">
                  {course.id} — {course.name}
                </span>

                <button
                  onClick={() => removeFavorite("courses", course.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Teachers */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Favorite Teachers</h2>

          <div className="space-y-3">
            {favorites.teachers.length === 0 && (
              <p className="text-gray-500">No favorite teachers.</p>
            )}
            {favorites.teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm"
              >
                <span className="font-medium">{teacher.name}</span>

                <button
                  onClick={() => removeFavorite("teachers", teacher.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Resources */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Favorite Resources</h2>

          <div className="space-y-3">
            {favorites.resources.length === 0 && (
              <p className="text-gray-500">No favorite resources.</p>
            )}
            {favorites.resources.map((res) => (
              <div
                key={res.id}
                className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm"
              >
                <div>
                  <a
                    href={res.link}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-blue-700"
                  >
                    {res.name}
                  </a>
                </div>

                <button
                  onClick={() => removeFavorite("resources", res.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
