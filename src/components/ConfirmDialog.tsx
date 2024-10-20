import React from 'react'
import { createRoot } from 'react-dom/client';

function createConfirmDialog(message: string, onConfirm: Function, onCancel: Function): void {
    const dialogRoot = document.createElement('div');
    document.body.appendChild(dialogRoot);

    const root = createRoot(dialogRoot);

    const ConfirmDialog = () => {
        const handleConfirm = () => {
            onConfirm();
            root.unmount();
            document.body.removeChild(dialogRoot);
        };

        const handleCancel = () => {
            onCancel();
            root.unmount();
            document.body.removeChild(dialogRoot);
        };

        return (
            <div className="z-50 confirm-dialog-overlay flex justify-center fixed w-full top-20 left-1 right-1 px-4 pl-2">
                <div className="confirm-dialog border-l-4 border-purple-600 max-w-[36rem] p-3 pb-2 bg-purple-200 rounded-r-2xl rounded-l-none shadow-lg shadow-purple-300">
                    <pre className=' text-wrap whitespace-pre-wrap'>{message}</pre>
                    <div className=' w-full flex justify-end space-x-4 mt-4 mb-1'>
                        <button className=' cursor-pointer px-2 rounded-full border-2 border-red-500 hover:bg-red-300' onClick={handleConfirm}>Confirm</button>
                        <button className=' cursor-pointer px-2 rounded-full border-2 border-purple-500 hover:bg-purple-300' onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    };

    root.render(<ConfirmDialog />);
};

export default createConfirmDialog
