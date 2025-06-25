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
                },
            }}
        >
        {children}
        <div style={{ marginTop: '1.5rem' }}>
            <button onClick={onRequestClose}>
                Cancel
            </button>
            <button onClick={onConfirm} className='bg-red-500'>
                Confirm
            </button>
        </div>
        </ReactModal>
    )
}