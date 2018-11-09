const expect = require('expect');
const request = require('supertest');

const { app } = require('../index');
const userModel = require('./../model/user');

function cleanAlmosEvery() {
  beforeEach(done => {
    userModel
      .deleteMany({
        email: {
          $ne: 'userone@userone.com'
        }
      })
      .then(() => done())
      .catch(e => done(e));
  });
}

describe('USER TEST: /api/v1/auth', function() {
  this.timeout(5000);

  cleanAlmosEvery();

  describe('POST /authMiddleware', function() {
    this.timeout(5000);

    it('should response 401 with no token provided', function(done) {
      this.timeout(5000);
      request(app)
        .post('/api/v1/image-upload')
        .expect(401)
        .expect(res => {
          expect(res.body.errors).toBeTruthy();
          expect(res.body.errors).toContainEqual({
            title: 'No autorizado !',
            description: 'Token no enviado.'
          });
        })
        .end(err => {
          if (err) return done(err);

          return done();
        });
    });
  });

  describe('POST /api/v1/auth/register', function() {
    this.timeout(5000);

    it('#should register a new user correctly', function(done) {
      this.timeout(4000);

      const user = {
        email: 'userTwo@userTwo.com',
        username: 'userTwo',
        password: 'userTwo',
        confirmPassword: 'userTwo'
      };

      request(app)
        .post('/api/v1/auth/register')
        .send(user)
        .expect(200)
        .expect(res => {
          expect(res.body.user).toHaveProperty('email', user.email.toLowerCase());
          expect(res.body.user).toHaveProperty('username', user.username);
        })
        .end(err => {
          expect(err).toBe(null);

          userModel
            .findOne({
              email: user.email
            })
            .then(foundUser => {
              expect(foundUser).toHaveProperty('username', user.username);
              expect(foundUser.hasSamePassword(user.password)).toBeTruthy();
              return done();
            })
            .catch(e => done(e));
        });
    });

    it('should throw 422 with undefined fields', function(done) {
      this.timeout(4000);

      const userOne = {
        email: 'userOne@userOne.com',
        password: 'userOne1234'
      };

      request(app)
        .post('/api/v1/auth/register')
        .expect(422)
        .end(async err => {
          if (err) done(err);

          userModel
            .find({
              email: userOne.email
            })
            .then(users => {
              expect(users.length).toBe(1);
              return done();
            })
            .catch(e => done(e));
        });
    });

    it('#should throw 422 with already email registered', done => {
      this.timeout(4000);

      const userOne = {
        email: 'userOne@userOne.com',
        username: 'userOne',
        password: 'userOne1234'
      };

      request(app)
        .post('/api/v1/auth/register')
        .expect(422)
        .end(err => {
          if (err) {
            return done(err);
          }

          userModel
            .find({
              email: userOne.email
            })
            .then(users => {
              expect(users.length).toBe(1);
              return done();
            })
            .catch(e => done(e));
        });
    });

    it('#should throw 422 with wrong password and confirmationPassword', function(done) {
      this.timeout(4000);

      const userOne = {
        email: 'userTwo@userTwo.com',
        username: 'userTwo',
        password: 'userTwoasdada',
        confirmPassword: 'userTwo'
      };

      request(app)
        .post('/api/v1/auth/register')
        .send(userOne)
        .expect(422)
        .expect(async res => {
          expect(res.body.errors).toContainEqual({
            title: 'Error con Contraseñas!',
            description: 'Las Contraseñas no coinciden.'
          });
        })
        .end(async err => {
          expect(err).toBeNull();

          userModel
            .find({
              email: userOne.email
            })
            .then(users => {
              expect(users.length).toBe(0);
              done();
            })
            .catch(e => done(e));
        });
    });
  });

  describe('POST /api/v1/auth/login', function() {
    this.timeout(4000);

    cleanAlmosEvery();

    it('#should authenticate correctly to an user', function(done) {
      this.timeout(4000);

      const userOne = {
        email: 'userone@userone.com',
        password: 'userOne'
      };

      request(app)
        .post('/api/v1/auth/login')
        .send(userOne)
        .expect(200)
        .expect(res => {
          expect(typeof res.body.token).toBe('string');
          expect(res.body.user).toHaveProperty('email', 'userone@userone.com');
        })
        .end(err => {
          if (err) return done(err);

          return done();
        });
    });

    it('#should throw 422 with no user', done => {
      this.timeout(4000);

      const userOne = {
        email: 'userone@useronee.com',
        password: 'userOne'
      };

      request(app)
        .post('/api/v1/auth/login')
        .send(userOne)
        .expect(422)
        .expect(res => {
          expect(res.body.errors).toContainEqual({
            title: 'Error !',
            description: 'Usuario no encontrado.'
          });
        })
        .end(err => {
          if (err) return done(err);

          done();
        });
    });

    it('#should throw 422 with different password', done => {
      this.timeout(4000);

      const userOne = {
        email: 'userone@userone.com',
        password: 'userOneee'
      };

      request(app)
        .post('/api/v1/auth/login')
        .send(userOne)
        .expect(422)
        .expect(res => {
          expect(res.body.errors).toContainEqual({
            title: 'Usuario y Contraseña invalidos !',
            description: 'El Usuario o la Contraseña no existen.'
          });
        })
        .end(err => {
          if (err) return done(err);

          done();
        });
    });
  });
});
