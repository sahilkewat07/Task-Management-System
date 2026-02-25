import Modal from './ui/Modal';
import { AlertTriangle } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', loading = false }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div className="flex flex-col items-center text-center px-2 py-2">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                    <AlertTriangle size={24} className="text-red-500" />
                </div>
                <h2 className="text-base font-semibold text-gray-800 mb-1.5">{title}</h2>
                <p className="text-sm text-gray-500 mb-6 max-w-xs">{message}</p>
                <div className="flex gap-3 w-full">
                    <button onClick={onClose} disabled={loading} className="btn-secondary flex-1 justify-center">Cancel</button>
                    <button onClick={onConfirm} disabled={loading} className="btn-danger flex-1 justify-center">
                        {loading ? <Loader2 size={15} className="animate-spin" /> : confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
