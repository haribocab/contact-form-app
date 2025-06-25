import ReactModal from 'react-modal';

export default function ConfirmModal ({isOpen, onRequestClose, onConfirm, children}) {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Confirm Delete"
            style={{
                content: {
                    maxWidth: '400px',
                    margin: 'auto',
                    padding: '2rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    height: 'auto',
                    maxHeight: '80vh',
                    overflow: 'auto', 
                    top: '50%',
                    bottom: 'auto',
                    transform: 'translateY(-50%)'
                },
            }}
        >
        {children}
        <div className='flex justify-between mt-6'>
            <button
             onClick={onRequestClose}
             className='bg-white px-4 py-2 border rounded'
             >
                Cancel
            </button>
            <button
             onClick={onConfirm}
             className='bg-primary px-4 py-2 border border-primary rounded'
             >
                Confirm
            </button>
        </div>
        </ReactModal>
    )
}