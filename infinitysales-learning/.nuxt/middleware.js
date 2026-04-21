const middleware = {}

middleware['auth_required'] = require('..\\middleware\\auth_required.js')
middleware['auth_required'] = middleware['auth_required'].default || middleware['auth_required']

export default middleware
