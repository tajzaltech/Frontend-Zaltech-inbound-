type StatusBadgeType = 'RINGING' | 'IN_PROGRESS' | 'COMPLETED' | 'DROPPED' | 'TRANSFERRED' | 'NEW' | 'FOLLOW_UP' | 'BOOKED' | 'LOST';

interface StatusBadgeProps {
    status: StatusBadgeType;
}

const statusConfig: Record<StatusBadgeType, { label: string; color: string }> = {
    RINGING: { label: 'Ringing', color: 'bg-gray-100 text-gray-700' },
    IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-700' },
    DROPPED: { label: 'Dropped', color: 'bg-red-100 text-red-700' },
    TRANSFERRED: { label: 'Transferred', color: 'bg-purple-100 text-purple-700' },
    NEW: { label: 'New', color: 'bg-blue-100 text-blue-700' },
    FOLLOW_UP: { label: 'Follow-up', color: 'bg-yellow-100 text-yellow-700' },
    BOOKED: { label: 'Booked', color: 'bg-green-100 text-green-700' },
    LOST: { label: 'Lost', color: 'bg-gray-100 text-gray-700' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <span className={`inline-block px-3 py-1 rounded-full text-meta font-medium ${config.color}`}>
            {config.label}
        </span>
    );
}
