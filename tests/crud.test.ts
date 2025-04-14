import { createUser, getUser, updateUser, deleteUser } from '../src/index';

describe('Operaciones CRUD en Cassandra', () => {
  let userId: string;

  it('debería crear un usuario', async () => {
    userId = await createUser('Bob', 25);
    expect(userId).toBeDefined();
  });

  it('debería leer los datos del usuario creado', async () => {
    const user = await getUser(userId);
    expect(user).toBeDefined();
    expect(user.name).toBe('Bob');
    expect(user.age).toBe(25);
  });

  it('debería actualizar el usuario', async () => {
    await updateUser(userId, 'Bob Actualizado', 26);
    const updatedUser = await getUser(userId);
    expect(updatedUser.name).toBe('Bob Actualizado');
    expect(updatedUser.age).toBe(26);
  });

  it('debería eliminar el usuario', async () => {
    await deleteUser(userId);
    const deletedUser = await getUser(userId);
    expect(deletedUser).toBeUndefined();
  });
});
