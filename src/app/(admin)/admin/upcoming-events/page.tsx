'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
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
  const [speakers, setSpeakers] = useState<SpeakerFormItem[]>([]);

  const editingEvent = useMemo(
    () => events.find((event) => event.id === editId) || null,
    [events, editId],
  );

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
    <main className="admin-events-page">
      <div className="admin-events-wrap">
        <header className="admin-events-header">
          <h1>Upcoming Events Management</h1>
          <p>Add, update, and control public upcoming events.</p>
        </header>

        <section className="admin-card">
          <h2>{editId ? 'Edit Upcoming Event' : 'Create Upcoming Event'}</h2>
          <form className="admin-events-form" onSubmit={saveEvent}>
            <label>
              Title
              <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>
            <label>
              Short Description
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>
            <label>
              Date
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </label>
            <label>
              Start Time
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </label>
            <label>
              End Time
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </label>
            <label>
              Location
              <input value={location} onChange={(e) => setLocation(e.target.value)} required />
            </label>
            <label>
              Registration / Action Link
              <input
                type="url"
                value={actionLink}
                onChange={(e) => setActionLink(e.target.value)}
                placeholder="https://..."
              />
            </label>
            <label>
              Status
              <select value={status} onChange={(e) => setStatus(e.target.value as UpcomingEventStatus)}>
                {STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Banner Image {editId ? '(optional while editing)' : ''}
              <input
                key={bannerInputKey}
                type="file"
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
              />
            </label>

            <div className="admin-speakers-editor">
              <div className="admin-speakers-header">
                <h3>Featured Speakers</h3>
                <button type="button" className="secondary" onClick={addSpeaker}>
                  Add Speaker
                </button>
              </div>

              {speakers.length === 0 && <p className="admin-editing-note">No speakers added yet.</p>}
              {speakers.map((speaker, index) => (
                <div key={speaker.id || `speaker-${index}`} className="admin-speaker-item">
                  <label>
                    Speaker Name
                    <input
                      value={speaker.name}
                      onChange={(e) => updateSpeaker(index, { name: e.target.value })}
                      placeholder="Speaker name"
                    />
                  </label>
                  <label>
                    Speaker Designation
                    <input
                      value={speaker.designation}
                      onChange={(e) => updateSpeaker(index, { designation: e.target.value })}
                      placeholder="Speaker position/designation"
                    />
                  </label>
                  <label>
                    Speaker Image
                    <input
                      key={`${speaker.id || index}-${speaker.fileInputKey}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        updateSpeaker(index, {
                          imageFile: e.target.files?.[0] || null,
                          removeImage: false,
                        })
                      }
                    />
                  </label>
                  {(speaker.imageUrl && !speaker.removeImage) || speaker.imageFile ? (
                    <div className="admin-speaker-preview">
                      <img
                        src={speaker.imageFile ? URL.createObjectURL(speaker.imageFile) : speaker.imageUrl}
                        alt={speaker.name || 'Speaker preview'}
                      />
                    </div>
                  ) : null}
                  <div className="admin-item-actions">
                    {speaker.imageUrl && !speaker.removeImage && (
                      <button
                        type="button"
                        className="danger"
                        onClick={() => updateSpeaker(index, { removeImage: true, imageFile: null })}
                      >
                        Remove image
                      </button>
                    )}
                    <button type="button" className="danger" onClick={() => removeSpeaker(index)}>
                      Remove speaker
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
          <h2>All Upcoming Records</h2>
          <div className="admin-events-list">
            {events.length === 0 && <p>No upcoming events found.</p>}
            {events.map((event) => (
              <article key={event.id} className="admin-event-item">
                <header>
                  <div>
                    <h3>{event.title}</h3>
                    <p>
                      {event.date} {event.startTime} - {event.endTime} | {event.location} | {event.status}
                    </p>
                  </div>
                  <div className="admin-item-actions">
                    <button type="button" className="secondary" onClick={() => startEdit(event)}>
                      Edit
                    </button>
                    <button type="button" className="danger" onClick={() => deleteEvent(event.id)}>
                      Delete
                    </button>
                  </div>
                </header>
              </article>
            ))}
          </div>
        </section>

        {editingEvent && (
          <p className="admin-editing-note">
            Editing: <strong>{editingEvent.title}</strong>
          </p>
        )}
      </div>
    </main>
  );
}
