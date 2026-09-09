export interface AuditLogEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  performedBy: string;
  performedAt: Date;
  details?: Record<string, unknown>;
}
