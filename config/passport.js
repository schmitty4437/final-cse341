const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { client } = require('../db/connection');
const { ObjectId } = require('mongodb');

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const githubId = profile.id;
      const username = profile.username || 'github_user';
      const email = profile.emails ? profile.emails[0].value : '';

      let user = await client
        .db('pizzaReviewDB')
        .collection('users')
        .findOne({ githubId: githubId });

      if (!user) {
        const newUser = {
          githubId: githubId,
          username: username,
          email: email,
          createdDate: new Date(),
          updatedDate: new Date(),
          role: 'user',
        };
        const result = await client
          .db('pizzaReviewDB')
          .collection('users')
          .insertOne(newUser);
        user = { _id: result.insertedId, ...newUser };
      } else {
        await client
          .db('pizzaReviewDB')
          .collection('users')
          .updateOne(
            { githubId: githubId },
            { $set: { updatedDate: new Date() } }
          );
      }

      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await client
    .db('pizzaReviewDB')
    .collection('users')
    .findOne({ _id: new ObjectId(id) });
  done(null, user);
});
