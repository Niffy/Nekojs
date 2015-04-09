/**
 *  Middleware initializor!!11
 *  @param  {Object} self
 *  @return {Function} init
 *  @api public
 */
module.exports = function initializor (self) {

    /**
     *  Return the middleware to start it all off...
     *  @param {Object} req
     *  @param {Object} req
     *  @param {Object} req
     *  @api public
     */
    return function init (req, res, next) {

      if (self.enabled('x-powered-by')) {
        res.setHeader('X-Powered-By', 'Framework');
      }

      req.res = res;
      res.req = req;
      req.next = next;

      req.__proto__ = self.request;
      res.__proto__ = self.response;

      res.locals = (res.locals || Object.create(null));

      next();
    };

};