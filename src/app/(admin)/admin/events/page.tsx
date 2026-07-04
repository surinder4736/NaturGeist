'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Trash2,
  UploadCloud,
  Video,
  X,
} from 'lucide-react';
import { EventRecord } from '@/lib/events/types';
import { MAX_IMAGE_SIZE_BYTES, MAX_VIDEO_SIZE_BYTES } from '@/lib/events/constants';

interface UploadResult {
  ok: boolean;
  status: number;
  payload: any;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function isSupportedType(file: File) {
  return (
    file.type.startsWith('image/') ||
    file.type === 'video/mp4' ||
    file.type === 'video/webm' ||
    file.type === 'video/ogg' ||
    file.type === 'video/quicktime'
  );
}

function validateFiles(files: File[]) {
  for (const file of files) {
    if (!isSupportedType(file)) return `Unsupported file type: ${file.name}`;
    if (file.type.startsWith('image/') && file.size > MAX_IMAGE_SIZE_BYTES) {
      return `${file.name} exceeds 8MB image limit`;
    }
    if (file.type.startsWith('video/') && file.size > MAX_VIDEO_SIZE_BYTES) {
      return `${file.name} exceeds 120MB video limit`;
    }
  }
  return '';
}

function uploadWithProgress(
  url: string,
  method: 'POST' | 'PUT',
  formData: FormData,
  onProgress: (value: number) => void,
) {
  return new Promise<UploadResult>((resolve, reject) => {
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
      resolve({ ok: xhr.status >= 200 && xhr.status < 300, status: xhr.status, payload });
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const editingEvent = useMemo(
    () => events.find((event) => event.id === editId) || null,
    [events, editId],
  );

  const totalMediaCount = useMemo(
    () => events.reduce((acc, event) => acc + event.media.length, 0),
    [events],
  );

  function handleFiles(incoming: FileList | null) {
    if (!incoming || incoming.length === 0) return;
    setFiles((prev) => [...prev, ...Array.from(incoming)]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function loadEvents() {
    const response = await fetch('/api/events');
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || 'Failed to load events');
    }
    setEvents(payload.events || []);
  }

  useEffect(() => {
    loadEvents().catch((e) => {
      setError(e instanceof Error ? e.message : 'Failed to load events');
    });
  }, []);

  function resetForm() {
    setTitle('');
    setDate('');
    setFiles([]);
    setFileInputKey((v) => v + 1);
    setEditId(null);
    setProgress(0);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !date) {
      setError('Title and date are required');
      return;
    }

    const fileValidationError = validateFiles(files);
    if (fileValidationError) {
      setError(fileValidationError);
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('date', date);
    files.forEach((file) => formData.append('media', file));

    try {
      setLoading(true);
      setProgress(0);

      const endpoint = editId ? `/api/events/${editId}` : '/api/events';
      const method = editId ? 'PUT' : 'POST';
      const result = await uploadWithProgress(endpoint, method, formData, setProgress);

      if (!result.ok) {
        throw new Error(result.payload?.error || 'Save failed');
      }

      await loadEvents();
      setSuccess(editId ? 'Event updated successfully' : 'Event created successfully');

      if (editId) {
        setFiles([]);
        setFileInputKey((v) => v + 1);
        const updatedEvent = result.payload?.event as EventRecord | undefined;
        if (updatedEvent) {
          setTitle(updatedEvent.title);
          setDate(updatedEvent.date);
          setEditId(updatedEvent.id);
        }
      } else {
        resetForm();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  function startEdit(target: EventRecord) {
    setEditId(target.id);
    setTitle(target.title);
    setDate(target.date);
    setFiles([]);
    setError('');
    setSuccess('');
    setProgress(0);
  }

  async function deleteEvent(eventId: string) {
    const confirmed = window.confirm('Delete this event and all uploaded media?');
    if (!confirmed) return;

    setError('');
    setSuccess('');
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Delete failed');

      await loadEvents();
      if (editId === eventId) resetForm();
      setSuccess('Event deleted');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setLoading(false);
    }
  }

  async function deleteMedia(eventId: string, mediaId: string) {
    const confirmed = window.confirm('Remove this media file?');
    if (!confirmed) return;

    setError('');
    setSuccess('');
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${eventId}/media/${mediaId}`, {
        method: 'DELETE',
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Media removal failed');

      await loadEvents();
      setSuccess('Media removed');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Media removal failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="ea-admin-page">
      <div className="ea-admin-shell">
        <header className="ea-admin-topbar">
          <div>
            <span className="ea-admin-eyebrow">Admin</span>
            <h1>Events Gallery</h1>
            <p>Upload event photos &amp; videos — everything is hosted on Cloudinary.</p>
          </div>
          <div className="ea-admin-stats">
            <div className="ea-stat">
              <strong>{events.length}</strong>
              <span>Events</span>
            </div>
            <div className="ea-stat">
              <strong>{totalMediaCount}</strong>
              <span>Media files</span>
            </div>
          </div>
        </header>

        {(error || success) && (
          <div className={`ea-banner ${error ? 'is-error' : 'is-success'}`} role="status">
            {error ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>{error || success}</span>
          </div>
        )}

        <div className="ea-admin-grid">
          <section className="ea-card ea-form-card">
            <div className="ea-card-header">
              <div>
                <h2>{editId ? 'Edit Event' : 'Create Event'}</h2>
                {editingEvent && <p className="ea-card-subtitle">Editing &ldquo;{editingEvent.title}&rdquo;</p>}
              </div>
              {editId && (
                <button type="button" className="ea-chip-btn" onClick={resetForm}>
                  <X size={14} /> Cancel edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="ea-form">
              <fieldset className="ea-fieldset">
                <div className="ea-fieldset-title">Event details</div>
                <div className="ea-field">
                  <label htmlFor="ea-title">Event title</label>
                  <input
                    id="ea-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Beach Cleanup Drive"
                    required
                  />
                </div>
                <div className="ea-field">
                  <label htmlFor="ea-date">
                    <Calendar size={14} /> Event date
                  </label>
                  <input id="ea-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
              </fieldset>

              <fieldset className="ea-fieldset">
                <div className="ea-fieldset-title">Media upload</div>
                <label
                  className={`ea-dropzone ${dragActive ? 'is-dragging' : ''}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    handleFiles(e.dataTransfer.files);
                  }}
                >
                  <input
                    key={fileInputKey}
                    type="file"
                    accept="image/*,video/mp4,video/webm,video/ogg,video/quicktime"
                    multiple
                    onChange={(e) => {
                      handleFiles(e.target.files);
                      setFileInputKey((v) => v + 1);
                    }}
                    hidden
                  />
                  <div className="ea-dropzone-placeholder">
                    <UploadCloud size={22} />
                    <span>Click or drag images/videos to upload</span>
                    <span className="ea-dropzone-hint">Images up to 8MB · Videos up to 120MB</span>
                  </div>
                </label>

                {files.length > 0 && (
                  <div className="ea-file-grid">
                    {files.map((file, index) => (
                      <div key={`${file.name}-${file.size}-${index}`} className="ea-file-card">
                        {file.type.startsWith('image/') ? (
                          <img src={URL.createObjectURL(file)} alt={file.name} />
                        ) : (
                          <div className="ea-file-video-icon">
                            <Video size={20} />
                          </div>
                        )}
                        <div className="ea-file-meta">
                          <span>{file.name}</span>
                          <span>{Math.ceil(file.size / 1024)} KB</span>
                        </div>
                        <button type="button" className="ea-file-remove" onClick={() => removeFile(index)}>
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </fieldset>

              <div className="ea-form-footer">
                {loading && progress > 0 && (
                  <div className="ea-progress">
                    <div style={{ width: `${progress}%` }} />
                  </div>
                )}
                <div className="ea-form-actions">
                  <button type="submit" className="ea-btn ea-btn-primary" disabled={loading}>
                    {loading && <Loader2 size={15} className="ea-spin" />}
                    {loading ? 'Saving...' : editId ? 'Update event' : 'Create event'}
                  </button>
                  {editId && (
                    <button type="button" className="ea-btn ea-btn-ghost" onClick={resetForm} disabled={loading}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          </section>

          <section className="ea-card ea-list-card">
            <div className="ea-card-header">
              <h2>All events</h2>
              <span className="ea-count-pill">{events.length}</span>
            </div>

            <div className="ea-event-list">
              {events.length === 0 && <p className="ea-empty-note">No events created yet.</p>}
              {events.map((eventItem) => {
                const imageCount = eventItem.media.filter((m) => m.type === 'image').length;
                const videoCount = eventItem.media.filter((m) => m.type === 'video').length;
                return (
                  <article
                    key={eventItem.id}
                    className={`ea-event-block ${editId === eventItem.id ? 'is-editing' : ''}`}
                  >
                    <header className="ea-event-block-header">
                      <div>
                        <h3>{eventItem.title}</h3>
                        <p>
                          <Calendar size={12} /> {formatDate(eventItem.date)}
                        </p>
                      </div>
                      <div className="ea-event-block-meta">
                        <span className="ea-badge ea-badge-image">
                          <ImageIcon size={11} /> {imageCount}
                        </span>
                        <span className="ea-badge ea-badge-video">
                          <Video size={11} /> {videoCount}
                        </span>
                      </div>
                      <div className="ea-row-actions">
                        <button type="button" onClick={() => startEdit(eventItem)} title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className="danger"
                          onClick={() => deleteEvent(eventItem.id)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </header>

                    {eventItem.media.length === 0 ? (
                      <p className="ea-empty-note">No media uploaded yet.</p>
                    ) : (
                      <div className="ea-media-grid">
                        {eventItem.media.map((media) => (
                          <div key={media.id} className="ea-media-card">
                            {media.type === 'image' ? (
                              <img src={media.url} alt={media.fileName} loading="lazy" />
                            ) : (
                              <video src={media.url} controls preload="metadata" />
                            )}
                            <button
                              type="button"
                              className="ea-media-remove"
                              title="Remove media"
                              onClick={() => deleteMedia(eventItem.id, media.id)}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
