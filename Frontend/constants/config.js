const local_ip = '10.18.87.51';
const aws_ip = 'ec2-18-144-72-202.us-west-1.compute.amazonaws.com';
const ip = aws_ip;

export default {
  ip,
  backend_server: 'http://' + ip + ':3000',
  backend_messaging: 'http://' + ip + ':3001',
  auth_server: 'http://' + ip + ':4000',
  link_ip: local_ip,
};
