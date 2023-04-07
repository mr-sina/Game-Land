function err404(req, res, next) {
    res.status(404).json({
        message : 'page not found'
    })
  };

  function err500(req, res, next) {
    res.status(500).json({
        message : 'error'
    })
  };
  
  export default {
    err404,
    err500
  }
  
  export default interface JsError extends Error{
    statusCode?: number,
    data?: any
}