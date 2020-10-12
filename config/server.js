module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: "https://coffee-trailer.herokuapp.com",
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'b3ab738876c91c33be341d87f7977360'),
    },
  },
});
