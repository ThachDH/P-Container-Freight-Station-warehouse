//Thoilc(*Note)-Mẫu Function Hook
//Link tham khảo: https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
const DecodeJWT = (token) => {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  let jsonPayload = decodeURIComponent(window.atob(base64).split('').map((item) => {
    return '%' + ('00' + item.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  // console.log(JSON.parse(jsonPayload));
  return JSON.parse(jsonPayload);
}

export default DecodeJWT;