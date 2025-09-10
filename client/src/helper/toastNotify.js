import { toast } from "react-toastify";

const toastNotify = ({ message, type = "success" }) => {
  toast(message, {
    type: type,
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  });
};

export default toastNotify;
