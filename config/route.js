const routes = [
  { path: '/', isDynamic: false, isNeedLogin: false, isNeedAdmin: false},
  { path: '/', isDynamic: true, isNeedLogin: false, isNeedAdmin: false}, // profile page
  { path: '/post', isDynamic: true, isNeedLogin: false, isNeedAdmin: false},
  { path: '/questions', isDynamic: false, isNeedLogin: false, isNeedAdmin: false},
  { path: '/question', isDynamic: false, isNeedLogin: false, isNeedAdmin: false},
  { path: '/login', isDynamic: false, isNeedLogin: false, isNeedAdmin: false},
  { path: '/register', isDynamic: false, isNeedLogin: false, isNeedAdmin: false},
  { path: '/reset-pass', isDynamic: false, isNeedLogin: false, isNeedAdmin: false},
  { path: '/reset-password', isDynamic: true, isNeedLogin: false, isNeedAdmin: false},
]

export default routes