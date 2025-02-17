// for generating random color for calendar date label
export const getLabelColor = (status: string) => {
  switch (status) {
    case 'SCHEDULED':
      return '#90CAF9';
    case 'COMPLETED':
      return '#A5D6A7';
    case 'FAILED_ERROR':
      return '#EF9A9A';
    case 'FAILED_USAGE_LIMITED':
      return '#FFCC80';
    default:
      return '#E0E0E0';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'SCHEDULED':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900';
    case 'FAILED_ERROR':
      return 'bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900';
    case 'FAILED_USAGE_LIMITED':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900';
  }
};
