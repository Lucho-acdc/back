import request from 'supertest';
import { app } from '../../src/main.js';
import UserModel from '../../src/models/userModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Sessions API', () => {

  before(async () => {
        
        await UserModel.deleteOne({ email: 'test@user.com' });
        await UserModel.deleteOne({ email: 'otro@usuario.com' });

    const testUser = new UserModel({
      name: 'Test User',
      lastname: 'User',
      email: 'test@user.com',
      password: 'password123',
      last_connection: new Date()
    });
    await testUser.save();

  });

  it('debería registrar un nuevo usuario', function (done) {

    this.timeout(3000);

    request(app)
      .post('/api/users/register')
      .send({
        name: 'Nuevo Usuario',
        lastname: 'Apellido',
        email: 'otro@usuario.com',
        password: 'password123'
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('debería iniciar sesión con un usuario registrado', (done) => {
    request(app)
      .post('/api/session/login')
      .send({
        email: 'nuevo@usuario.com',
        password: 'password123'
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('debería permitir subir documentos', (done) => {

    const newUser = new UserModel({
      name: 'Document Test User',
      lastname: 'User',
      email: 'document@test.com',
      password: 'password123',
      last_connection: new Date()
    });

    newUser.save().then(savedUser => {
      const testFilePath = path.join(__dirname, '../documents/test.pdf');
      const newTestUserId = savedUser._id.toString();

      request(app)
        .post(`/api/users/${newTestUserId}/documents`)
        .attach('documents', testFilePath)
        .end((err, res) => {
          if (err) return done(err);
          if (res.status !== 200) return done(new Error(`Expected status 200 but got ${res.status}`));
          done();
        });
    }).catch(err => done(err));
  });

  after(async () => {
    await UserModel.deleteOne({ email: 'document@test.com' });
  });

  it('debería cerrar sesión', (done) => {
    request(app)
      .post('/api/session/logout')
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

});
