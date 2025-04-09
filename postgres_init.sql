CREATE TABLE Movies (
  movie_id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  release_year INTEGER,
  genre_id INTEGER,
  rating TEXT,
  duration INTEGER
);

INSERT INTO Movies (title, release_year, genre_id, rating, duration) VALUES
('Interstellar', 2014, 4, 'PG-13', 169),
('The Godfather', 1972, 1, 'R', 175),
('Mad Max: Fury Road', 2015, 2, 'R', 120),
('Superbad', 2007, 3, 'R', 113),
('Barbie', 2023, 3, 'PG-13', 114),
('Oppenheimer', 2023, 1, 'R', 180);
