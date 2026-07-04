'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Link2,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  UploadCloud,
  Users,
  X,
} from 'lucide-react';
import {
  UpcomingEventRecord,
  UpcomingEventSpeaker,
  UpcomingEventStatus,
} from '@/lib/upcoming-events/types';

const STATUSES: UpcomingEventStatus[] = ['ACTIVE', 'DRAFT', 'CANCELLED'];
const SPEAKER_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

interface SpeakerFormItem {
  id?: string;
  name: string;
  designation: string;
  imageUrl: string;
  imageStoragePath: string;
  imageFile: File | null;
  removeImage: boolean;
  fileInputKey: number;
}

function uploadWithProgress(
  url: string,
  method: 'POST' | 'PUT',
  formData: FormData,
  onProgress: (value: number) => void,
) {
  return new Promise<{ ok: boolean; payload: any }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      let payload: any = {};
      try {
        payload = JSON.parse(xhr.responseText || '{}');
      } catch {
        payload = {};
      }
      resolve({ ok: xhr.status >= 200 && xhr.status < 300, payload });
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}

export default function AdminUpcomingEventsPage() {
  const [events, setEvents] = useState<UpcomingEventRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [actionLink, setActionLink] = useState('');
  const [status, setStatus] = useState<UpcomingEventStatus>('ACTIVE');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerInputKey, setBannerInputKey] = useState(0);
  const [bannerDragActive, setBannerDragActive] = useState(false);
  const [speakers, setSpeakers] = useState<SpeakerFormItem[]>([]);

  const editingEvent = useMemo(
    () => events.find((event) => event.id === editId) || null,
    [events, editId],
  );

  const bannerPreviewUrl = useMemo(
    () => (bannerFile ? URL.createObjectURL(bannerFile) : editingEvent?.bannerUrl || ''),
    [bannerFile, editingEvent],
  );

  const activeCount = useMemo(
    () => events.filter((event) => event.status === 'ACTIVE').length,
    [events],
  );

  function handleBannerFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) setBannerFile(file);
  }

  async function loadEvents() {
    const response = await fetch('/api/admin/upcoming-events');
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'Failed to load events');
    setEvents(payload.events || []);
  }

  useEffect(() => {
    loadEvents().catch((e) => {
      setError(e instanceof Error ? e.message : 'Failed to load events');
    });
  }, []);

  function resetForm() {
    setEditId(null);
    setTitle('');
    setDescription('');
    setDate('');
    setStartTime('');
    setEndTime('');
    setLocation('');
    setActionLink('');
    setStatus('ACTIVE');
    setBannerFile(null);
    setBannerInputKey((v) => v + 1);
    setSpeakers([]);
    setProgress(0);
  }

  function mapSpeakerForEdit(speaker: UpcomingEventSpeaker): SpeakerFormItem {
    return {
      id: speaker.id,
      name: speaker.name,
      designation: speaker.designation,
      imageUrl: speaker.imageUrl,
      imageStoragePath: speaker.imageStoragePath,
      imageFile: null,
      removeImage: false,
      fileInputKey: 0,
    };
  }

  function startEdit(event: UpcomingEventRecord) {
    setEditId(event.id);
    setTitle(event.title);
    setDescription(event.description);
    setDate(event.date);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setLocation(event.location);
    setActionLink(event.actionLink);
    setStatus(event.status);
    setBannerFile(null);
    setBannerInputKey((v) => v + 1);
    setSpeakers((event.speakers || []).map(mapSpeakerForEdit));
    setError('');
    setSuccess('');
    setProgress(0);
  }

  function addSpeaker() {
    setSpeakers((prev) => [
      ...prev,
      {
        name: '',
        designation: '',
        imageUrl: '',
        imageStoragePath: '',
        imageFile: null,
        removeImage: false,
        fileInputKey: 0,
      },
    ]);
  }

  function removeSpeaker(index: number) {
    setSpeakers((prev) => prev.filter((_, i) => i !== index));
  }

  function updateSpeaker(index: number, patch: Partial<SpeakerFormItem>) {
    setSpeakers((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  async function saveEvent(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (
      !title.trim() ||
      !description.trim() ||
      !date ||
      !startTime ||
      !endTime ||
      !location.trim()
    ) {
      setError('Please fill all required fields');
      return;
    }

    if (new Date(`2000-01-01T${endTime}`).getTime() <= new Date(`2000-01-01T${startTime}`).getTime()) {
      setError('End time must be later than start time');
      return;
    }

    for (let i = 0; i < speakers.length; i += 1) {
      const speaker = speakers[i];
      if (!speaker.name.trim() || !speaker.designation.trim()) {
        setError(`Speaker ${i + 1}: name and designation are required`);
        return;
      }

      if (
        speaker.imageFile &&
        (!speaker.imageFile.type.startsWith('image/') ||
          speaker.imageFile.size > SPEAKER_IMAGE_MAX_BYTES)
      ) {
        setError(`Speaker ${i + 1}: image must be an image under 5MB`);
        return;
      }

      const hasImage = Boolean(speaker.imageUrl && !speaker.removeImage) || Boolean(speaker.imageFile);
      if (!hasImage) {
        setError(`Speaker ${i + 1}: image is required`);
        return;
      }
    }

    if (!editId && !bannerFile) {
      setError('Banner image is required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('date', date);
    formData.append('startTime', startTime);
    formData.append('endTime', endTime);
    formData.append('location', location.trim());
    formData.append('actionLink', actionLink.trim());
    formData.append('status', status);
    if (bannerFile) formData.append('banner', bannerFile);

    const speakersJson = speakers.map((speaker) => ({
      id: speaker.id,
      name: speaker.name.trim(),
      designation: speaker.designation.trim(),
      existingImageUrl: speaker.imageUrl,
      existingImageStoragePath: speaker.imageStoragePath,
      removeImage: speaker.removeImage,
    }));
    formData.append('speakersJson', JSON.stringify(speakersJson));
    speakers.forEach((speaker, index) => {
      if (speaker.imageFile) {
        formData.append(`speakerImage_${index}`, speaker.imageFile);
      }
    });

    try {
      setLoading(true);
      setProgress(0);
      const endpoint = editId
        ? `/api/admin/upcoming-events/${editId}`
        : '/api/admin/upcoming-events';
      const method = editId ? 'PUT' : 'POST';
      const result = await uploadWithProgress(endpoint, method, formData, setProgress);

      if (!result.ok) {
        throw new Error(result.payload?.error || 'Save failed');
      }

      await loadEvents();
      setSuccess(editId ? 'Upcoming event updated' : 'Upcoming event created');
      if (editId) {
        const updatedEvent = result.payload?.event as UpcomingEventRecord | undefined;
        setBannerFile(null);
        setBannerInputKey((v) => v + 1);
        if (updatedEvent) {
          setTitle(updatedEvent.title);
          setDescription(updatedEvent.description);
          setDate(updatedEvent.date);
          setStartTime(updatedEvent.startTime);
          setEndTime(updatedEvent.endTime);
          setLocation(updatedEvent.location);
          setActionLink(updatedEvent.actionLink);
          setStatus(updatedEvent.status);
          setSpeakers((updatedEvent.speakers || []).map(mapSpeakerForEdit));
        } else {
          setSpeakers((prev) =>
            prev.map((speaker) => ({
              ...speaker,
              imageFile: null,
              removeImage: false,
              fileInputKey: speaker.fileInputKey + 1,
            })),
          );
        }
      } else {
        resetForm();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  async function deleteEvent(eventId: string) {
    if (!window.confirm('Delete this upcoming event?')) return;
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/upcoming-events/${eventId}`, {
        method: 'DELETE',
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Delete failed');

      await loadEvents();
      if (editId === eventId) resetForm();
      setSuccess('Upcoming event deleted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="uea-admin-page">
      <div className="uea-admin-shell">
        <header className="uea-admin-topbar">
          <div>
            <span className="uea-admin-eyebrow">Admin</span>
            <h1>Upcoming Events</h1>
            <p>Create, publish and manage events shown on the public Upcoming Events page.</p>
          </div>
          <div className="uea-admin-stats">
            <div className="uea-stat">
              <strong>{events.length}</strong>
              <span>Total</span>
            </div>
            <div className="uea-stat uea-stat-active">
              <strong>{activeCount}</strong>
              <span>Active</span>
            </div>
          </div>
        </header>

        {(error || success) && (
          <div className={`uea-banner ${error ? 'is-error' : 'is-success'}`} role="status">
            {error ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>{error || success}</span>
          </div>
        )}

        <div className="uea-admin-grid">
          <section className="uea-card uea-form-card">
            <div className="uea-card-header">
              <div>
                <h2>{editId ? 'Edit Event' : 'Create Event'}</h2>
                {editingEvent && <p className="uea-card-subtitle">Editing &ldquo;{editingEvent.title}&rdquo;</p>}
              </div>
              {editId && (
                <button type="button" className="uea-chip-btn" onClick={resetForm}>
                  <X size={14} /> Cancel edit
                </button>
              )}
            </div>

            <form className="uea-form" onSubmit={saveEvent}>
              <fieldset className="uea-fieldset">
                <div className="uea-fieldset-title">Event details</div>
                <div className="uea-field">
                  <label htmlFor="uea-title">Title</label>
                  <input
                    id="uea-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Annual Tree Plantation Drive"
                    required
                  />
                </div>
                <div className="uea-field">
                  <label htmlFor="uea-description">Short description</label>
                  <textarea
                    id="uea-description"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="One or two lines shown on the landing page"
                    required
                  />
                </div>
              </fieldset>

              <fieldset className="uea-fieldset">
                <div className="uea-fieldset-title">Schedule &amp; location</div>
                <div className="uea-field-row">
                  <div className="uea-field">
                    <label htmlFor="uea-date">
                      <Calendar size={14} /> Date
                    </label>
                    <input id="uea-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                  </div>
                  <div className="uea-field">
                    <label htmlFor="uea-start">
                      <Clock size={14} /> Start time
                    </label>
                    <input
                      id="uea-start"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>
                  <div className="uea-field">
                    <label htmlFor="uea-end">
                      <Clock size={14} /> End time
                    </label>
                    <input
                      id="uea-end"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="uea-field-row">
                  <div className="uea-field">
                    <label htmlFor="uea-location">
                      <MapPin size={14} /> Location
                    </label>
                    <input
                      id="uea-location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Venue / address"
                      required
                    />
                  </div>
                  <div className="uea-field">
                    <label htmlFor="uea-link">
                      <Link2 size={14} /> Registration link
                    </label>
                    <input
                      id="uea-link"
                      type="url"
                      value={actionLink}
                      onChange={(e) => setActionLink(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="uea-field">
                  <label>Status</label>
                  <div className="uea-status-toggle">
                    {STATUSES.map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`uea-status-pill uea-status-${value.toLowerCase()} ${
                          status === value ? 'is-active' : ''
                        }`}
                        onClick={() => setStatus(value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </fieldset>

              <fieldset className="uea-fieldset">
                <div className="uea-fieldset-title">Banner image</div>
                <label
                  className={`uea-dropzone ${bannerDragActive ? 'is-dragging' : ''}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setBannerDragActive(true);
                  }}
                  onDragLeave={() => setBannerDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setBannerDragActive(false);
                    handleBannerFiles(e.dataTransfer.files);
                  }}
                >
                  <input
                    key={bannerInputKey}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBannerFiles(e.target.files)}
                    hidden
                  />
                  {bannerPreviewUrl ? (
                    <img src={bannerPreviewUrl} alt="Banner preview" className="uea-dropzone-preview" />
                  ) : (
                    <div className="uea-dropzone-placeholder">
                      <UploadCloud size={22} />
                      <span>Click or drag an image to upload</span>
                    </div>
                  )}
                </label>
                {editId && <p className="uea-hint">Leave empty to keep the current banner.</p>}
              </fieldset>

              <fieldset className="uea-fieldset">
                <div className="uea-fieldset-title uea-fieldset-title-row">
                  <span>
                    <Users size={14} /> Featured speakers
                  </span>
                  <button type="button" className="uea-chip-btn" onClick={addSpeaker}>
                    <Plus size={14} /> Add speaker
                  </button>
                </div>

                {speakers.length === 0 && <p className="uea-empty-note">No speakers added yet.</p>}

                <div className="uea-speaker-grid">
                  {speakers.map((speaker, index) => (
                    <div key={speaker.id || `speaker-${index}`} className="uea-speaker-card">
                      <div className="uea-speaker-avatar">
                        {(speaker.imageUrl && !speaker.removeImage) || speaker.imageFile ? (
                          <img
                            src={speaker.imageFile ? URL.createObjectURL(speaker.imageFile) : speaker.imageUrl}
                            alt={speaker.name || 'Speaker preview'}
                          />
                        ) : (
                          <Users size={18} />
                        )}
                      </div>
                      <div className="uea-speaker-fields">
                        <input
                          value={speaker.name}
                          onChange={(e) => updateSpeaker(index, { name: e.target.value })}
                          placeholder="Speaker name"
                        />
                        <input
                          value={speaker.designation}
                          onChange={(e) => updateSpeaker(index, { designation: e.target.value })}
                          placeholder="Designation"
                        />
                        <input
                          key={`${speaker.id || index}-${speaker.fileInputKey}`}
                          type="file"
                          accept="image/*"
                          className="uea-speaker-file"
                          onChange={(e) =>
                            updateSpeaker(index, {
                              imageFile: e.target.files?.[0] || null,
                              removeImage: false,
                            })
                          }
                        />
                      </div>
                      <div className="uea-speaker-actions">
                        {speaker.imageUrl && !speaker.removeImage && (
                          <button
                            type="button"
                            onClick={() => updateSpeaker(index, { removeImage: true, imageFile: null })}
                          >
                            Remove image
                          </button>
                        )}
                        <button type="button" className="danger" onClick={() => removeSpeaker(index)}>
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>

              <div className="uea-form-footer">
                {loading && progress > 0 && (
                  <div className="uea-progress">
                    <div style={{ width: `${progress}%` }} />
                  </div>
                )}
                <div className="uea-form-actions">
                  <button type="submit" className="uea-btn uea-btn-primary" disabled={loading}>
                    {loading && <Loader2 size={15} className="uea-spin" />}
                    {loading ? 'Saving...' : editId ? 'Update event' : 'Create event'}
                  </button>
                  {editId && (
                    <button type="button" className="uea-btn uea-btn-ghost" onClick={resetForm} disabled={loading}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          </section>

          <section className="uea-card uea-list-card">
            <div className="uea-card-header">
              <h2>All records</h2>
              <span className="uea-count-pill">{events.length}</span>
            </div>

            <div className="uea-event-list">
              {events.length === 0 && <p className="uea-empty-note">No upcoming events found.</p>}
              {events.map((event) => (
                <article key={event.id} className={`uea-event-row ${editId === event.id ? 'is-editing' : ''}`}>
                  <div className="uea-event-thumb">
                    {event.bannerUrl ? <img src={event.bannerUrl} alt={event.title} /> : <Calendar size={18} />}
                  </div>
                  <div className="uea-event-info">
                    <h3>{event.title}</h3>
                    <div className="uea-event-meta">
                      <span>
                        <Calendar size={12} /> {event.date}
                      </span>
                      <span>
                        <Clock size={12} /> {event.startTime}-{event.endTime}
                      </span>
                      <span>
                        <MapPin size={12} /> {event.location}
                      </span>
                    </div>
                  </div>
                  <span className={`uea-badge uea-badge-${event.status.toLowerCase()}`}>{event.status}</span>
                  <div className="uea-row-actions">
                    <button type="button" onClick={() => startEdit(event)} title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button type="button" className="danger" onClick={() => deleteEvent(event.id)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
