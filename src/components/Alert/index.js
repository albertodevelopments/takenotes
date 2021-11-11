// Dependencias
import PropTypes from 'prop-types'

import './styles.css'

const Alert = ({ type, message }) => {
    return (
        <div
            className={`message-box ${
                type === 'error' ? 'error-box' : 'success-box'
            }`}
        >
            <span>{message}</span>
        </div>
    )
}

export default Alert

Alert.propTypes = {
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
}
