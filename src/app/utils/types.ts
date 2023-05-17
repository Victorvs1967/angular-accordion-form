export class Type {
  key: string;
  title: string;
  description: string;

  constructor(key: string = '', title: string = '', description: string = '') {
    this.key = key;
    this.title = title;
    this.description = description;
  }
}

export const types: Type[] = [
  { key: 'food', title: 'Food', description: 'All types of food' },
  { key: 'fruit', title: 'Fruit', description: 'All types of fruit' },
  { key: 'footboll', title: 'Footboll', description: 'All types of footboll' },
  { key: 'footwear', title: 'Footwear', description: 'All types of footwear' },
  { key: 'foam', title: 'Foam', description: 'All types of foam' },
  { key: 'folklore', title: 'Folklore', description: 'All types of folklore' },
  { key: 'movies', title: 'Movies', description: 'All types of movies' },
  { key: 'music', title: 'Music', description: 'All types of music' },
  { key: 'books', title: 'Books', description: 'All types of books' },
  { key: 'sports', title: 'Sports', description: 'All types of sports' },
  { key: 'games', title: 'Games', description: 'All types of games' },
];
