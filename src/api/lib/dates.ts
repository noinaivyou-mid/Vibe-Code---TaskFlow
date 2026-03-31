export function combineDueAt(dueDate?: string | null, dueTime?: string | null) {
  if (!dueDate) {
    return null;
  }

  const [year, month, day] = dueDate.split('-').map(Number);
  const [hours, minutes] = (dueTime || '12:00').split(':').map(Number);

  return new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
}

export function splitDueAt(dueAt?: Date | null) {
  if (!dueAt) {
    return {
      dueDate: null,
      dueTime: null,
    };
  }

  const year = dueAt.getUTCFullYear();
  const month = String(dueAt.getUTCMonth() + 1).padStart(2, '0');
  const day = String(dueAt.getUTCDate()).padStart(2, '0');
  const hours = String(dueAt.getUTCHours()).padStart(2, '0');
  const minutes = String(dueAt.getUTCMinutes()).padStart(2, '0');

  return {
    dueDate: `${year}-${month}-${day}`,
    dueTime: `${hours}:${minutes}`,
  };
}
