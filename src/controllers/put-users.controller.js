/**
 * @param {{
 *   userService: UserService,
 *   method: string,
 *   path: string,
 *   request: {
 *     body: {
 *       users: [{nickname: string, email:string}],
 *     },
 *   },
 * }} ctx
 * @returns {Promise<void>}
 * @constructor
 */
export const PutUsersController = async (ctx) => {
  const { method, path } = ctx;
  const { users } = ctx.request.body;
  if (!/^PUT \/users$/.test(`${method} ${path}`)) {
    return;
  }

  const results = users.map((user) => ctx.userService.add(user));

  ctx.body = {
    results: await Promise.all(results),
  };
};

// export const PutUsersControllerExample = (userService) => async (ctx) => {
//   const { method, path } = ctx;
//   const { users } = ctx.request.body;

//   if (!/^PUT \/users$/.test(`${method} ${path}`)) {
//     return;
//   }

//   const results = users.map((user) => userService.add(user));

//   ctx.body = {
//     results: await Promise.all(results),
//   };
// };
