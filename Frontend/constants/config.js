const local_ip = '192.168.86.110';
const aws_ip = 'ec2-13-56-226-47.us-west-1.compute.amazonaws.com';

const ip = aws_ip;

export default {
  ip,
  backend_server: 'http://' + ip + ':3000',
  backend_messaging: 'http://' + ip + ':3001',
  auth_server: 'http://' + ip + ':4000',
};
