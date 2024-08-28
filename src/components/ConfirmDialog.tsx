import React from 'react'
import { createRoot } from 'react-dom/client';

function createConfirmDialog(message: string, onConfirm: Function, onCancel: Function): void {
    console.log("DD")
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
            <div className="z-40 confirm-dialog-overlay flex justify-center fixed w-full top-20 left-0 right-0  px-2">
                <div className=" border-l-4 border-l-purple-700 confirm-dialog w-96 p-3 pb-2 bg-purple-200 rounded-md shadow-md">
                    <p>{message}</p>
                    <div className='w-full flex justify-end space-x-4 mt-4'>
                        <button className='cursor-pointer px-2 rounded-md bg-red-400 hover:bg-red-500' onClick={handleConfirm}>Confirm</button>
                        <button className='cursor-pointer px-2 rounded-md bg-purple-400 hover:bg-purple-500' onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    };

    root.render(<ConfirmDialog />);
};

export default createConfirmDialog