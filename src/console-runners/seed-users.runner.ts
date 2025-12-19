import prompts from 'prompts';
import { dbServer } from '#core/servers/index.js';
import { ENV } from '#core/constants/env.constants.js';
import { hash } from '#common/helpers/hash.helpers.js';

export const run = async () => {
  if (!dbServer.db) {
    throw new Error(
      'Database not connected. Run console-runners and connect first.'
    );
  }

  const { email, password, role } = await prompts([
    {
      name: 'email',
      type: 'text',
      message: 'User email:',
      initial: ENV.AUTH_USERNAME ?? 'admin@email.com',
    },
    {
      name: 'password',
      type: 'password',
      message: 'User password:',
      initial: ENV.AUTH_PASSWORD ?? 'admin',
    },
    {
      name: 'role',
      type: 'select',
      message: 'Role:',
      choices: [
        { title: 'admin', value: 'admin' },
        { title: 'user', value: 'user' },
      ],
      initial: 0,
    },
  ]);

  const users = dbServer.db.collection('users');

  const passwordHash = await hash(password);

  await users.updateOne(
    { email },
    { $set: { email, password: passwordHash, role } },
    { upsert: true }
  );

  console.log(`Seeded user: ${email} (${role})`);
};
