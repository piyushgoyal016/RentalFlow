export default function StatusBadge({ status }) {
  const map = {
    ACTIVE:     { label: "Active",     cls: "badge-active"    },
    PENDING:    { label: "Pending",    cls: "badge-pending"   },
    OVERDUE:    { label: "Overdue",    cls: "badge-overdue"   },
    COMPLETED:  { label: "Completed", cls: "badge-completed"  },
    CANCELLED:  { label: "Cancelled", cls: "badge-cancelled"  },
    REFUNDED:   { label: "Refunded",  cls: "badge-refunded"   },
    FAILED:     { label: "Failed",    cls: "badge-failed"     },
    // generic true/false
    true:       { label: "Yes",       cls: "badge-active"    },
    false:      { label: "No",        cls: "badge-cancelled" },
  };

  const cfg = map[status] || { label: status, cls: "badge-cancelled" };

  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>;
}
