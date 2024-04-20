import { useEffect } from "react";

//Link tham khảo: 
//https://dev.to/olumidesamuel_/implementing-autologout-feature-in-web-applications-react-js-28k5
//https://github.com/LuminousIT/auth-protected-route/tree/auto-logout-feature
const events = [
  "load",
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
];

const AppLogout = ({ children }) => {
  let timer;

  useEffect(() => {
    Object.values(events).forEach((item) => {
      window.addEventListener(item, () => {
        resetTimer();
        handleTimer();
      });
    });
  }, []);

  const resetTimer = () => {
    if (timer) clearTimeout(timer);
  };

  const handleTimer = () => {
    if (localStorage.getItem("userInfo") === null) {
      timer = setTimeout(() => {
        resetTimer();
        Object.values(events).forEach((item) => {
          window.removeEventListener(item, resetTimer);
        });
        logoutAction();
      }, 10000);
    }
  };

  const logoutAction = () => {
    localStorage.clear();
    window.location.assign("/login");
  };
  return children;
};

export default AppLogout;