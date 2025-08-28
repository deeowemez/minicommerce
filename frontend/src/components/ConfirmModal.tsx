/**
 * src/components/ConfirmModal.tsx
 */

import React from 'react';

interface ConfirmModalProps {
  adds: any[];
  updates: any[];
  deletes: any[];
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  adds,
  updates,
  deletes,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirm Bulk Action</h2>

        <ul className="mb-4 space-y-2 text-gray-700 text-sm">
          <li>
            <strong>{adds.length}</strong> item(s) will be added
            {adds.length > 0 && (
              <div style={{
                display: 'flex',
                overflowX: 'auto',
                gap: '8px',
                padding: '6px 0',
                whiteSpace: 'nowrap'
              }}>
                {adds.map((item, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      background: '#f1f1f1',
                      borderRadius: '4px',
                      flex: '0 0 auto'
                    }}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            )}
          </li>

          <li>
            <strong>{updates.length}</strong> item(s) will be updated
            {updates.length > 0 && (
              <div style={{
                display: 'flex',
                overflowX: 'auto',
                gap: '8px',
                padding: '6px 0',
                whiteSpace: 'nowrap'
              }}>
                {updates.map((item, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      background: '#e0f7fa',
                      borderRadius: '4px',
                      flex: '0 0 auto'
                    }}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            )}
          </li>

          <li>
            <strong>{deletes.length}</strong> item(s) will be deleted
            {deletes.length > 0 && (
              <div style={{
                display: 'flex',
                overflowX: 'auto',
                gap: '8px',
                padding: '6px 0',
                whiteSpace: 'nowrap'
              }}>
                {deletes.map((item, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      background: '#ffebee',
                      borderRadius: '4px',
                      flex: '0 0 auto'
                    }}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            )}
          </li>

        </ul>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="cursor-pointer px-4 py-2 text-sm rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer px-4 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-800"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
