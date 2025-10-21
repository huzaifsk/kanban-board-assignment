import React from 'react';
import { AlertCircle } from 'lucide-react';

const HelpNote = () => {
  return (
    <div className="help-note">
      <AlertCircle size={14} />
      <span>Double-click on any task card to edit • Drag cards to move between columns</span>
    </div>
  );
};

export default React.memo(HelpNote);
