const local_ip = '172.16.100.7';
const aws_ip = 'ec2-54-241-210-48.us-west-1.compute.amazonaws.com';

const ip = aws_ip;

export default {
  backend_server: 'http://' + ip + ':3000',
  backend_messaging: 'http://' + ip + ':3001',
};
