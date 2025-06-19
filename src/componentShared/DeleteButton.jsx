import React from 'react';
import { Trash2 } from 'lucide-react';
import { LoadingAnimation } from '../features/animations';
import styles from '../styles/DeleteButton.module.css';

/**
 * Reusable delete button component with trash icon
 * @param {Function} onClick - Click handler function
 * @param {boolean} isLoading - Whether the button is in loading state
 * @param {boolean} disabled - Whether the button is disabled
 * @param {string} title - Tooltip text for the button
 * @param {object} style - Additional style overrides
 */
function DeleteButton({
  onClick,
  isLoading = false,
  disabled = false,
  title = 'Delete',
  style = {},
}) {
  return (
    <button
      className={styles['delete-button']}
      onClick={onClick}
      disabled={disabled || isLoading}
      title={title}
      style={style}
    >
      {isLoading ? (
        <LoadingAnimation size="small" style={{ width: 24, height: 24 }} />
      ) : (
        <Trash2 size={16} />
      )}
    </button>
  );
}

export default DeleteButton;
