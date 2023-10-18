import { UserListRepo } from '../repo/user-list.repo';

export class UserService {
  /**
   * @param {RepositoryService} repositoryService
   * @param {EmailService} emailService
   */
  constructor({ repositoryService, emailService }) {
    this.repositoryService = repositoryService;
    this.emailService = emailService;
  }

  /**
   *
   * @param {string} nickname
   * @param {string} email
   * @returns {Promise<Object>}
   */
  async add({ nickname, email }) {
    return this.repositoryService.transaction(
      [UserListRepo],
      async ({ userList }) => {
        const userId = await userList.insert({ nickname });
        const emailId = await this.emailService.add({ email });

        /**
         * Тут асинхронные запросы не взаимосвязаны поэтому их можно запустить одновременно:
         * Например:
         * const [userId, emailId] = await Promise.all([
          userList.insert({ nickname }),
          this.emailService.add({ email }),
        ]);
         */

        return { userId, emailId };
      },
    );
  }
}
