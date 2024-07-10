import { toast } from 'react-toastify';

class ToastService {
  showInfo(message) {
    toast.info(message);
  }

  showSuccess(message) {
    toast.success(message);
  }

  showWarning(message) {
    toast.warning(message);
  }

  showError(message) {
    toast.error(message);
  }
}

const toastService = new ToastService();
export default toastService;
