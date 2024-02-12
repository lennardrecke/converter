import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // Your Sentry DSN
  dsn: "https://839a0978030437a73fdfb74be3a1a9c4@o4506733085523968.ingest.sentry.io/4506734040055808",
  
  // Enable Spotlight in development
  spotlight: process.env.NODE_ENV === 'development',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
