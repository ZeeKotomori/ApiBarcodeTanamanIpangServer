import 'bulma/css/bulma.min.css';

export default function Modal({ isActive, closeModal, children }) {
   return (
      <div className={`modal ${isActive ? 'is-active' : ''}`}>
         <div className="modal-background" onClick={closeModal}></div>
         <div className="modal-content">
            {children}
         </div>
         <button className="modal-close is-large" aria-label="close" onClick={closeModal}></button>
      </div>
   )
};