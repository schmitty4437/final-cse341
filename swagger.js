const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Pizza Review App',
    description: 'Use GitHub login to manage pizza reviews and favorites',
  },
  host: 'final-cse341.onrender.com',
  schemes: ['https'],
  securityDefinitions: {
    JWT: {
      type: 'apiKey',
      in: 'cookie',
      name: 'jwt',
      description: 'JWT token stored in cookie',
    },
  },
  security: [{ JWT: [] }],
  definitions: {
    Pizza: {
      name: 'string',
      brand: 'string',
      description: 'string',
      createdDate: 'string',
      updatedDate: 'string',
    },
    Review: {
      userId: 'string',
      pizzaId: 'string',
      rating: 'number',
      commentReview: 'string',
      createdDate: 'string',
      updatedDate: 'string',
      priceRating: 'number',
    },
    Favorite: {
      pizzaId: 'string',
      reviewId: 'string',
      createdDate: 'string',
      updatedDate: 'string',
    },
    User: {
      username: 'string',
      email: 'string',
      githubId: 'string',
      createdDate: 'string',
      updatedDate: 'string',
    },
  },
};

const outputFile = './swagger.json';
const routes = [
  './routes/index.js',
  './routes/reviews.js',
  './routes/pizzas.js',
  './routes/favorites.js',
  './routes/users.js',
];

swaggerAutogen(outputFile, routes, doc);
