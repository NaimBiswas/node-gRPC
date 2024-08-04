const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = './service.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const proto = grpc.loadPackageDefinition(packageDefinition).crud;

const client = new proto.CrudService('50051', grpc.credentials.createInsecure());

client.createUser({ name: 'John Doe', email: 'john.doe@example.com' }, (error, response) => {
  if (!error) {
    console.log('User created:', response);
  } else {
    console.error(error);
  }
});

client.getUser({ id: 1 }, (error, response) => {
  if (!error) {
    console.log('User fetched:', response);
  } else {
    console.error(error);
  }
});

client.updateUser({ id: 1, name: 'John Smith', email: 'john.smith@example.com' }, (error, response) => {
  if (!error) {
    console.log('User updated:', response);
  } else {
    console.error(error);
  }
});

client.deleteUser({ id: 1 }, (error, response) => {
  if (!error) {
    console.log('User deleted:', response);
  } else {
    console.error(error);
  }
});