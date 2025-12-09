import { toast } from "sonner";

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationOptions {
  type?: NotificationType;
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export class NotificationManager {
  static show(options: NotificationOptions | string) {
    if (typeof options === 'string') {
      return toast(options);
    }

    const { type = 'info', title, description, duration, action } = options;

    const message = title || description || 'Notification';
    const toastFn = this.getToastFunction(type);

    return toastFn(message, {
      description: title && description ? description : undefined,
      duration: duration || this.getDefaultDuration(type),
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
    });
  }

  static success(message: string, options?: Omit<NotificationOptions, 'type'>) {
    return this.show({ ...options, type: 'success', title: message });
  }

  static error(message: string, options?: Omit<NotificationOptions, 'type'>) {
    return this.show({ ...options, type: 'error', title: message });
  }

  static warning(message: string, options?: Omit<NotificationOptions, 'type'>) {
    return this.show({ ...options, type: 'warning', title: message });
  }

  static info(message: string, options?: Omit<NotificationOptions, 'type'>) {
    return this.show({ ...options, type: 'info', title: message });
  }

  // Vehicle-specific notifications
  static vehicleAdded(make: string, model: string) {
    return this.success(`Vehicle added successfully`, {
      description: `${make} ${model} has been added to your inventory.`,
    });
  }

  static vehicleUpdated(make: string, model: string) {
    return this.success(`Vehicle updated`, {
      description: `${make} ${model} information has been updated.`,
    });
  }

  static vehicleDeleted(make: string, model: string) {
    return this.success(`Vehicle removed`, {
      description: `${make} ${model} has been removed from inventory.`,
      action: {
        label: 'Undo',
        onClick: () => {
          // This would need to be implemented with a proper undo mechanism
          console.log('Undo vehicle deletion');
        },
      },
    });
  }

  static leadCreated(name: string) {
    return this.success(`Lead created`, {
      description: `New lead for ${name} has been added.`,
    });
  }

  static saleRecorded(customerName: string, vehicleName: string) {
    return this.success(`Sale recorded`, {
      description: `Sale of ${vehicleName} to ${customerName} has been recorded.`,
    });
  }

  static expenseAdded(amount: number, category: string) {
    return this.success(`Expense added`, {
      description: `$${amount.toLocaleString()} expense added to ${category}.`,
    });
  }

  // Error notifications
  static operationFailed(operation: string, error?: string) {
    return this.error(`${operation} failed`, {
      description: error || 'Please try again or contact support if the problem persists.',
    });
  }

  static validationError(field: string, message: string) {
    return this.warning(`Validation Error`, {
      description: `${field}: ${message}`,
    });
  }

  static networkError() {
    return this.error(`Connection Error`, {
      description: 'Please check your internet connection and try again.',
    });
  }

  static unauthorized() {
    return this.error(`Access Denied`, {
      description: 'You don\'t have permission to perform this action.',
    });
  }

  private static getToastFunction(type: NotificationType) {
    switch (type) {
      case 'success':
        return toast.success;
      case 'error':
        return toast.error;
      case 'warning':
        return toast.warning;
      case 'info':
      default:
        return toast;
    }
  }

  private static getDefaultDuration(type: NotificationType): number {
    switch (type) {
      case 'error':
        return 5000; // 5 seconds for errors
      case 'warning':
        return 4000; // 4 seconds for warnings
      case 'success':
        return 3000; // 3 seconds for success
      case 'info':
      default:
        return 3000; // 3 seconds for info
    }
  }
}

// Export the class instance for convenience
export const notify = NotificationManager;
