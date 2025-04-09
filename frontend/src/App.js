import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [editingMovie, setEditingMovie] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('');
  const [duration, setDuration] = useState('');

  const genres = [
    { genre_id: 1, name: 'Drama' },
    { genre_id: 2, name: 'Action' },
    { genre_id: 3, name: 'Comedy' },
    { genre_id: 4, name: 'Sci-Fi' },
  ];

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    axios.get('http://localhost:3001/movies')
      .then(res => setMovies(res.data))
      .catch(err => console.error(err));
  };

  const handleAddMovie = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/movies', {
      title,
      release_year: parseInt(year),
      genre_id: parseInt(genre),
      rating,
      duration: parseInt(duration)
    }).then(() => {
      fetchMovies();
      setTitle('');
      setYear('');
      setGenre('');
      setRating('');
      setDuration('');
    });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/movies/${id}`).then(() => fetchMovies());
  };

  const startEdit = (movie) => {
    setEditingMovie(movie.movie_id);
    setEditForm({ ...movie });
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = () => {
    axios.put(`http://localhost:3001/movies/${editingMovie}`, {
      ...editForm,
      release_year: parseInt(editForm.release_year),
      genre_id: parseInt(editForm.genre_id),
      duration: parseInt(editForm.duration)
    }).then(() => {
      setEditingMovie(null);
      fetchMovies();
    });
  };

  const filteredMovies = movies
    .filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(m => !selectedGenre || m.genre_id === parseInt(selectedGenre));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-6">🎬 Cinematrix</h1>

        <div className="flex gap-4 mb-6">
          <select
            className="border rounded p-2 flex-1"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map(g => (
              <option key={g.genre_id} value={g.genre_id}>{g.name}</option>
            ))}
          </select>

          <input
            className="border rounded p-2 flex-1"
            placeholder="Search title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <form onSubmit={handleAddMovie} className="bg-white p-4 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Add a New Movie</h2>
          <div className="grid grid-cols-2 gap-4">
            <input className="border p-2 rounded" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input className="border p-2 rounded" placeholder="Year" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
            <select className="border p-2 rounded" value={genre} onChange={(e) => setGenre(e.target.value)}>
              <option value="">Genre</option>
              {genres.map(g => (
                <option key={g.genre_id} value={g.genre_id}>{g.name}</option>
              ))}
            </select>
            <input className="border p-2 rounded" placeholder="Rating (e.g. PG-13)" value={rating} onChange={(e) => setRating(e.target.value)} />
            <input className="border p-2 rounded" placeholder="Duration (min)" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>
          <button type="submit" className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
            Add Movie
          </button>
        </form>

        <ul className="space-y-4">
          {filteredMovies.map(movie => (
            <li key={movie.movie_id} className="bg-white p-4 rounded shadow flex justify-between items-start">
              {editingMovie === movie.movie_id ? (
                <div className="flex flex-col w-full gap-2">
                  <input className="border p-1 rounded" value={editForm.title} onChange={(e) => handleEditChange('title', e.target.value)} />
                  <input className="border p-1 rounded" type="number" value={editForm.release_year} onChange={(e) => handleEditChange('release_year', e.target.value)} />
                  <select className="border p-1 rounded" value={editForm.genre_id} onChange={(e) => handleEditChange('genre_id', e.target.value)}>
                    {genres.map(g => (
                      <option key={g.genre_id} value={g.genre_id}>{g.name}</option>
                    ))}
                  </select>
                  <input className="border p-1 rounded" value={editForm.rating} onChange={(e) => handleEditChange('rating', e.target.value)} />
                  <input className="border p-1 rounded" type="number" value={editForm.duration} onChange={(e) => handleEditChange('duration', e.target.value)} />
                  <div className="flex gap-2 mt-2">
                    <button onClick={handleSaveEdit} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">Save</button>
                    <button onClick={() => setEditingMovie(null)} className="text-gray-600">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-semibold">{movie.title}</h3>
                    <p className="text-sm text-gray-600">
                      {movie.release_year} | {movie.rating} | {movie.duration} min
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <button onClick={() => startEdit(movie)} className="text-blue-600 hover:underline text-sm">✏️ Edit</button>
                    <button onClick={() => handleDelete(movie.movie_id)} className="text-red-600 hover:underline text-sm">✖️ Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
