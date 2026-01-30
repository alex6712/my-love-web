export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  albums: '/albums',
  album: (id: string) => `/albums/${id}`,
  albumCreate: '/albums/create',
  files: '/files',
  notes: '/notes',
  profile: '/profile',
} as const

export type RouteKey = keyof typeof routes
