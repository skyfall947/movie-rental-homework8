import { CreateMovieDto } from '../../src/movies/dto/create-movie.dto';

export const movieToCreate: CreateMovieDto = {
  title: 'movie',
  trailerUrl: 'https://www.youtube.com/watch?v=SgSrpnW0EmU',
  price: 15,
  stock: 10,
  likes: 1,
  description: 'Description movie',
};
