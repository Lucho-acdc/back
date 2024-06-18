import request from 'supertest';
import { app } from '../../src/main.js';
import UserModel from '../../src/models/userModel.js';


describe('Sessions API', () => {
  before(async () => {
    await UserModel.deleteOne({ email: 'nuevo@usuario.com' });
  });

  it('debería registrar un nuevo usuario', (done) => {
    request(app)
      .post('/api/users/register')
      .send({
        name: 'Nuevo Usuario',
        lastname: 'Apellido',
        email: 'nuevo@usuario.com',
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
  
  it('debería cerrar sesión', (done) => {
    request(app)
      .post('/api/session/logout')
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

});
