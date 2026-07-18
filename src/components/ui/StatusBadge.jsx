import { getStatusColor } from '../../lib/utils';

export default function StatusBadge({ status }) {
  const formattedStatus = status.replace('_', ' ');
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(status)} capitalize`}>
      {formattedStatus}
    </span>
  );
}
