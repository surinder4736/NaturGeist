'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
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
  const [editId, setEditId] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const editingEvent = useMemo(
    () => events.find((event) => event.id === editId) || null,
    [events, editId],
  );

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
    <main className="admin-events-page">
      <div className="admin-events-wrap">
        <header className="admin-events-header">
          <h1>Events Management</h1>
          <p>Create, update, and manage event media.</p>
        </header>

        <section className="admin-card">
          <h2>{editId ? 'Edit Event' : 'Create Event'}</h2>
          <form onSubmit={handleSubmit} className="admin-events-form">
            <label>
              Event Title
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
                required
              />
            </label>
            <label>
              Event Date
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </label>
            <label>
              Upload Images/Videos
              <input
                key={fileInputKey}
                type="file"
                accept="image/*,video/mp4,video/webm,video/ogg,video/quicktime"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
            </label>

            {files.length > 0 && (
              <ul className="admin-file-list">
                {files.map((file) => (
                  <li key={`${file.name}-${file.size}`}>
                    {file.name} ({Math.ceil(file.size / 1024)} KB)
                  </li>
                ))}
              </ul>
            )}

            {loading && progress > 0 && (
              <div className="admin-progress">
                <div style={{ width: `${progress}%` }} />
              </div>
            )}

            <div className="admin-form-actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : editId ? 'Update Event' : 'Create Event'}
              </button>
              {editId && (
                <button type="button" className="secondary" onClick={resetForm} disabled={loading}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          {error && <p className="admin-state admin-error">{error}</p>}
          {success && <p className="admin-state admin-success">{success}</p>}
        </section>

        <section className="admin-card">
          <h2>Existing Events</h2>
          <div className="admin-events-list">
            {events.length === 0 && <p>No events created yet.</p>}
            {events.map((eventItem) => (
              <article key={eventItem.id} className="admin-event-item">
                <header>
                  <div>
                    <h3>{eventItem.title}</h3>
                    <p>{formatDate(eventItem.date)}</p>
                  </div>
                  <div className="admin-item-actions">
                    <button type="button" className="secondary" onClick={() => startEdit(eventItem)}>
                      Edit
                    </button>
                    <button type="button" className="danger" onClick={() => deleteEvent(eventItem.id)}>
                      Delete
                    </button>
                  </div>
                </header>

                <div className="admin-media-grid">
                  {eventItem.media.map((media) => (
                    <div key={media.id} className="admin-media-card">
                      {media.type === 'image' ? (
                        <img src={media.url} alt={media.fileName} loading="lazy" />
                      ) : (
                        <video src={media.url} controls preload="metadata" />
                      )}
                      <div className="admin-media-meta">
                        <p>{media.fileName}</p>
                        <button
                          type="button"
                          className="danger"
                          onClick={() => deleteMedia(eventItem.id, media.id)}
                        >
                          Remove media
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {editingEvent && (
          <p className="admin-editing-note">
            Editing: <strong>{editingEvent.title}</strong> ({formatDate(editingEvent.date)})
          </p>
        )}
      </div>
    </main>
  );
}
