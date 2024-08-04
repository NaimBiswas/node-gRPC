const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const pool = require('./db/db');

const PROTO_PATH = './service.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const proto = grpc.loadPackageDefinition(packageDefinition).crud;

const server = new grpc.Server();

server.addService(proto.CrudService.service, {
  createUser: (call, callback) => {
    const { name, email } = call.request;
    pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email],
      (error, results) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, results.rows[0]);
        }
      }
    );
  },
  getUser: (call, callback) => {
    const { id } = call.request;
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        callback(error, null);
      } else if (results.rows.length === 0) {
        callback(new Error('User not found'), null);
      } else {
        callback(null, results.rows[0]);
      }
    });
  },
  updateUser: (call, callback) => {
    const { id, name, email } = call.request;
    pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id],
      (error, results) => {
        if (error) {
          callback(error, null);
        } else if (results.rows.length === 0) {
          callback(new Error('User not found'), null);
        } else {
          callback(null, results.rows[0]);
        }
      }
    );
  },
  deleteUser: (call, callback) => {
    const { id } = call.request;
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, { message: 'User deleted successfully' });
      }
    });
  },
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  console.log('gRPC server running at http://0.0.0.0:50051');
});
