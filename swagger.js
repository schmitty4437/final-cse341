const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Pizza Review App',
    description: 'Use GitHub login to review and favorite pizzas'
  },
  host: 'cse341pizza.onrender.com',
  schemes: ['https'],
  // host: 'localhost:3000',
  // schemes: ['http'],
  securityDefinitions: {
    JWT: {
      type: 'apiKey',
      in: 'cookie',
      name: 'jwt',
      description: 'JWT token stored in cookie'
    }
  },
  // Added JWT to protected routes
  security: [{ JWT: [] }],
  definitions: {
    Pizza: {
      name: 'string',
      brand: 'string',
      description: 'string',
      createdDate: 'string',
      updatedDate: 'string'
    },
    Review: {
      userId: 'string',
      pizzaId: 'string',
      rating: 'integer',
      commentReview: 'string',
      createdDate: 'string',
      updatedDate: 'string',
      priceRating: 'integer'
    },
    Favorite: {
      pizzaId: 'string',
      reviewId: 'string',
      createdDate: 'string',
      updatedDate: 'string'
    },
    User: {
      username: 'string',
      email: 'string',
      oAuth: 'string',
      createdDate: 'string',
      updatedDate: 'string'
    },
    Login: {
      email: 'string',
      password: 'string'
    }
  }
};

const outputFile = './swagger.json';
const routes = [
  './routes/index.js',
  './routes/pizzas.js',
  './routes/reviews.js',
  './routes/favorites.js',
  './routes/users.js'
];

swaggerAutogen(outputFile, routes, doc);