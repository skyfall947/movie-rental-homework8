import { CreateMovieDto } from '../../src/movies/dto/create-movie.dto';

export const movieToCreate: CreateMovieDto = {
  title: 'movie',
  trailerUrl: 'https://www.youtube.com/watch?v=SgSrpnW0EmU',
  price: 15,
  stock: 10,
  likes: 1,
  description: 'Description movie',
};

export const unsortedMoviesTitle = [
  {
    title: 'Bbb',
  },
  {
    title: 'Ccc',
  },
  {
    title: 'Aaa',
  },
];
export const sortedMoviesTitleAsc = [
  {
    title: 'Aaa',
  },
  {
    title: 'Bbb',
  },
  {
    title: 'Ccc',
  },
];

export const unsortedMoviesLikes = [
  {
    likes: 15,
  },
  {
    likes: 20,
  },
  {
    likes: 10,
  },
];
export const sortedMoviesLikesAsc = [
  {
    likes: 10,
  },
  {
    likes: 15,
  },
  {
    likes: 20,
  },
];

export const moviesToSortByTitle = [
  {
    title: 'Avengers',
    tags: [{ title: 'comedy' }, { title: 'action' }],
  },
  {
    title: 'Coco',
    tags: [{ title: 'comedy' }, { title: 'animation' }],
  },
  {
    title: 'Dune',
    tags: [{ title: 'sci-fi' }, { title: 'action' }],
  },
  {
    title: 'Hamilton',
    tags: [{ title: 'musical' }, { title: 'documetary' }],
  },
];
