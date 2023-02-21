
import { toast } from 'react-toastify';
function displayToast(type = "success", message) {
    if(!["success", "error", "info", "warning"].includes(type)) return;

    toast[type](message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        limit: 1
    });
}

export default displayToast