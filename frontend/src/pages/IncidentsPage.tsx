import { useEffect, useState, useCallback } from 'react';
import { Header } from '../components/layout/Header';
import { incidentsApi } from '../api/incidents.api';
import type { Incident, PaginatedIncidents, FilterParams } from '../types/incident.types';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function IncidentsPage() {
  const [data, setData] = useState<PaginatedIncidents | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
    limit: 20,
    sortBy: 'incidentDate',
    sortOrder: 'desc',
  });
  const [searchInput, setSearchInput] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const debouncedSearch = useDebounce(searchInput, 300);

  const fetchIncidents = useCallback(async () => {
    try {
      setLoading(true);
      const result = await incidentsApi.getAll({
        ...filters,
        search: debouncedSearch || undefined,
      });
      setData(result);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleSort = (field: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleFilterChange = (key: keyof FilterParams, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
      page: 1, // Reset to first page on filter change
    }));
  };

  const handleCreateNew = () => {
    setSelectedIncident(null);
    setFormMode('create');
    setShowModal(true);
  };

  const handleEdit = (incident: Incident) => {
    setSelectedIncident(incident);
    setFormMode('edit');
    setShowModal(true);
  };

  const handleDelete = (incident: Incident) => {
    setSelectedIncident(incident);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedIncident) return;
    try {
      await incidentsApi.delete(selectedIncident.id);
      setShowDeleteModal(false);
      setSelectedIncident(null);
      fetchIncidents();
    } catch (error) {
      console.error('Error deleting incident:', error);
    }
  };

  const getSeverityBadge = (level: number) => {
    const classes = {
      0: 'badge badge-success',
      1: 'badge badge-success',
      2: 'badge badge-warning',
      3: 'badge badge-warning',
      4: 'badge badge-danger',
      5: 'badge badge-danger',
    };
    return classes[level as keyof typeof classes] || 'badge badge-info';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Header title="Incidents" subtitle="Manage near miss incidents" />
      <div className="page-content">
        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="filter-group" style={{ flex: 2 }}>
            <label className="filter-label">Search</label>
            <input
              type="text"
              className="input"
              placeholder="Search by location, cause, job..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Severity</label>
            <select
              className="input select"
              value={filters.severityLevel || ''}
              onChange={(e) => handleFilterChange('severityLevel', e.target.value)}
            >
              <option value="">All</option>
              <option value="0">Level 0</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="4">Level 4</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Region</label>
            <input
              type="text"
              className="input"
              placeholder="Filter by region"
              value={filters.region || ''}
              onChange={(e) => handleFilterChange('region', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Year</label>
            <select
              className="input select"
              value={filters.year || ''}
              onChange={(e) => handleFilterChange('year', e.target.value ? parseInt(e.target.value) : '')}
            >
              <option value="">All</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>

          <div className="filter-group" style={{ alignSelf: 'flex-end' }}>
            <button className="btn btn-primary" onClick={handleCreateNew}>
              + Add Incident
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => handleSort('incidentNumber')} style={{ cursor: 'pointer' }}>
                  Incident # {filters.sortBy === 'incidentNumber' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('incidentDate')} style={{ cursor: 'pointer' }}>
                  Date {filters.sortBy === 'incidentDate' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('severityLevel')} style={{ cursor: 'pointer' }}>
                  Severity {filters.sortBy === 'severityLevel' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Action Cause</th>
                <th>Region</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7}>
                    <div className="loading-container">
                      <div className="spinner"></div>
                    </div>
                  </td>
                </tr>
              ) : data?.data.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    No incidents found
                  </td>
                </tr>
              ) : (
                data?.data.map((incident) => (
                  <tr key={incident.id}>
                    <td>{incident.incidentNumber}</td>
                    <td>{formatDate(incident.incidentDate)}</td>
                    <td>
                      <span className={getSeverityBadge(incident.severityLevel)}>
                        Level {incident.severityLevel}
                      </span>
                    </td>
                    <td>{incident.actionCause || '-'}</td>
                    <td>{incident.region || '-'}</td>
                    <td>{incident.location || '-'}</td>
                    <td>
                      <div className="flex gap-sm">
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleEdit(incident)}
                          style={{ padding: 'var(--spacing-xs)' }}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(incident)}
                          style={{ padding: 'var(--spacing-xs)' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {data && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {((data.meta.page - 1) * data.meta.limit) + 1} to{' '}
                {Math.min(data.meta.page * data.meta.limit, data.meta.total)} of {data.meta.total} results
              </div>
              <div className="pagination-buttons">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(data.meta.page - 1)}
                  disabled={!data.meta.hasPrevPage}
                >
                  Prev
                </button>
                {Array.from({ length: Math.min(5, data.meta.totalPages) }, (_, i) => {
                  const startPage = Math.max(1, data.meta.page - 2);
                  const page = startPage + i;
                  if (page > data.meta.totalPages) return null;
                  return (
                    <button
                      key={page}
                      className={`pagination-btn ${page === data.meta.page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(data.meta.page + 1)}
                  disabled={!data.meta.hasNextPage}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Edit/Create Modal */}
        {showModal && (
          <IncidentModal
            incident={selectedIncident}
            mode={formMode}
            onClose={() => setShowModal(false)}
            onSave={() => {
              setShowModal(false);
              fetchIncidents();
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedIncident && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Confirm Delete</h3>
                <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                  ✕
                </button>
              </div>
              <p>
                Are you sure you want to delete incident{' '}
                <strong>{selectedIncident.incidentNumber}</strong>? This action cannot be undone.
              </p>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Incident Modal Component
interface IncidentModalProps {
  incident: Incident | null;
  mode: 'create' | 'edit';
  onClose: () => void;
  onSave: () => void;
}

// Helper functions for date calculations
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime() + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function IncidentModal({ incident, mode, onClose, onSave }: IncidentModalProps) {
  const [formData, setFormData] = useState({
    incidentNumber: incident?.incidentNumber || '',
    incidentDate: incident?.incidentDate?.split('T')[0] || new Date().toISOString().split('T')[0],
    severityLevel: incident?.severityLevel || 0,
    actionCause: incident?.actionCause || '',
    behaviorType: incident?.behaviorType || '',
    gbu: incident?.gbu || '',
    region: incident?.region || '',
    primaryCategory: incident?.primaryCategory || '',
    nearMissSubCategory: incident?.nearMissSubCategory || '',
    unsafeConditionOrBehavior: incident?.unsafeConditionOrBehavior || '',
    companyType: incident?.companyType || '',
    location: incident?.location || '',
    job: incident?.job || '',
    craftCode: incident?.craftCode || '',
    year: incident?.year || new Date().getFullYear(),
    month: incident?.month || new Date().getMonth() + 1,
    week: incident?.week || getWeekNumber(new Date()),
    dayOfYear: incident?.dayOfYear || getDayOfYear(new Date()),
    isLcv: incident?.isLcv || false,
  });
  const [saving, setSaving] = useState(false);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (mode === 'create') {
        await incidentsApi.create(formData);
      } else if (incident) {
        await incidentsApi.update(incident.id, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving incident:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? Number(value) : value,
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', maxHeight: '85vh', overflow: 'auto' }}>
        <div className="modal-header">
          <h3 className="modal-title">
            {mode === 'create' ? 'Create Incident' : 'Edit Incident'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <h4 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Basic Information</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
            <div className="form-group">
              <label className="form-label">Incident Number *</label>
              <input
                type="text"
                name="incidentNumber"
                className="input"
                value={formData.incidentNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                name="incidentDate"
                className="input"
                value={formData.incidentDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Severity Level *</label>
              <select
                name="severityLevel"
                className="input select"
                value={formData.severityLevel}
                onChange={handleChange}
              >
                <option value={0}>Level 0 - Minimal</option>
                <option value={1}>Level 1 - Low</option>
                <option value={2}>Level 2 - Moderate</option>
                <option value={3}>Level 3 - High</option>
                <option value={4}>Level 4 - Severe</option>
                <option value={5}>Level 5 - Critical</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Primary Category</label>
              <input
                type="text"
                name="primaryCategory"
                className="input"
                placeholder="e.g., Safety, Equipment"
                value={formData.primaryCategory}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Incident Details */}
          <h4 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Incident Details</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
            <div className="form-group">
              <label className="form-label">Near Miss Sub-Category</label>
              <input
                type="text"
                name="nearMissSubCategory"
                className="input"
                placeholder="Sub-category of near miss"
                value={formData.nearMissSubCategory}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Behavior Type</label>
              <input
                type="text"
                name="behaviorType"
                className="input"
                placeholder="e.g., Unsafe Act, Procedure Violation"
                value={formData.behaviorType}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Action Cause</label>
              <input
                type="text"
                name="actionCause"
                className="input"
                placeholder="Root cause of the incident"
                value={formData.actionCause}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Company Type</label>
              <input
                type="text"
                name="companyType"
                className="input"
                placeholder="e.g., Contractor, Internal"
                value={formData.companyType}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Unsafe Condition or Behavior</label>
              <textarea
                name="unsafeConditionOrBehavior"
                className="input"
                style={{ minHeight: '80px', resize: 'vertical' }}
                placeholder="Describe the unsafe condition or behavior"
                value={formData.unsafeConditionOrBehavior}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Location Information */}
          <h4 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location Information</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
            <div className="form-group">
              <label className="form-label">Region</label>
              <input
                type="text"
                name="region"
                className="input"
                placeholder="Geographic region"
                value={formData.region}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">GBU (Business Unit)</label>
              <input
                type="text"
                name="gbu"
                className="input"
                placeholder="Business unit"
                value={formData.gbu}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="input"
                placeholder="Specific location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Job</label>
              <input
                type="text"
                name="job"
                className="input"
                placeholder="Job or project name"
                value={formData.job}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Craft Code</label>
              <input
                type="text"
                name="craftCode"
                className="input"
                placeholder="Craft or trade code"
                value={formData.craftCode}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Time Information */}
          <h4 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time Information</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
            <div className="form-group">
              <label className="form-label">Year *</label>
              <input
                type="number"
                name="year"
                className="input"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Month *</label>
              <input
                type="number"
                name="month"
                className="input"
                min={1}
                max={12}
                value={formData.month}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Week</label>
              <input
                type="number"
                name="week"
                className="input"
                min={1}
                max={53}
                value={formData.week}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Day of Year</label>
              <input
                type="number"
                name="dayOfYear"
                className="input"
                min={1}
                max={366}
                value={formData.dayOfYear}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Flags */}
          <div className="form-group" style={{ marginTop: 'var(--spacing-md)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="isLcv"
                checked={formData.isLcv}
                onChange={handleChange}
              />
              <span>Is LCV (Life-Changing Event)</span>
            </label>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

