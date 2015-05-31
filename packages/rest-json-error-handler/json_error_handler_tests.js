if (Meteor.isServer) {
  // TODO: Add error handling middleware after all other middleware, so connect errors can be triggered from endpoints (currently only works if triggered from other middleware)
  //JsonRoutes.errorMiddleware.use(
  //  '/handle-error',
  //  RestMiddleware.handleErrorAsJson
  //);

  // For testing purposes, trigger error from middleware above error handler in
  // stack
  JsonRoutes.middleWare.use(
    '/handle-error',
    function (req, res, next) {
      next({
        statusCode: 400,
        error: 'test-error',
        reason: 'test reason'
      });
    }
  );
  JsonRoutes.middleWare.use(
    '/handle-error',
    RestMiddleware.handleErrorAsJson
  );

  JsonRoutes.add('get', 'handle-error', function (req, res, next) {
    // Currently unable to propagate error from within an endpoint
    //next({statusCode: 400, error: 'test-error', reason: 'test reason'});
    JsonRoutes.sendResult(res, 400, true);
  });
}
else { // Meteor.isClient
  testAsyncMulti('Middleware - JSON Error Handling - handle standard Connect error with JSON response', [
    function (test, waitFor) {
      HTTP.get(Meteor.absoluteUrl('/handle-error'),
        waitFor(function (err, resp) {
          test.equal(resp.statusCode, 400);
          test.equal(resp.data.error, 'test-error');
          test.equal(resp.data.reason, 'test reason');
      }));
    }
  ]);
}
