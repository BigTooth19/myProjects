import request from '@/plugin/axios';
import base64 from 'base-64';

export function AccountLogin(data) {
  return request.post('/user/authorize/login', {
    tel: base64.encode(data.tel),
    pwd: base64.encode(data.pwd)
  });
}
