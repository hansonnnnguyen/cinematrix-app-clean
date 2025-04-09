DROP TABLE IF EXISTS Movies;

CREATE TABLE Movies (
  movie_id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  release_year INTEGER,
  genre_id INTEGER,
  rating TEXT,
  duration INTEGER
);
