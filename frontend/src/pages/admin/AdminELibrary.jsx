import React, { useEffect, useMemo, useState } from 'react'
import { Upload, PlusCircle, FileText, BookOpen, X } from 'lucide-react'
import { api } from '../../lib/api'

export default function AdminELibrary() {
  const [resources, setResources] = useState([])
  const [classOptions, setClassOptions] = useState([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [title, setTitle] = useState('')
  const [grade, setGrade] = useState('')
  const [format, setFormat] = useState('PDF')
  const [fileUrl, setFileUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [selectedFileName, setSelectedFileName] = useState('')
  const [selectedImageName, setSelectedImageName] = useState('')

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
      reader.onerror = () => reject(new Error('Failed to read selected file'))
      reader.readAsDataURL(file)
    })

  const fetchResources = async () => {
    try {
      setError('')
      const response = await api('/lms/library-resources?limit=300')
      setResources(response.items || [])
    } catch (err) {
      setError(err.message || 'Failed to load resources')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Fetch live classes and extract unique class_name values
  const fetchClassOptions = async () => {
    try {
      const response = await api('/lms/live-classes?limit=300')
      const items = response.items || response || []
      const uniqueClasses = [...new Set(
        items
          .map((item) => item.class_name)
          .filter(Boolean)
      )]
      setClassOptions(uniqueClasses)
      if (uniqueClasses.length > 0) setGrade(uniqueClasses[0])
    } catch (err) {
      console.error('Failed to load class options:', err)
    }
  }

  useEffect(() => {
    fetchResources()
    fetchClassOptions()
  }, [])

  const normalizedResources = useMemo(
    () =>
      resources.map((item) => ({
        id: item._id || item.id,
        title: item.title || '-',
        grade: item.grade || '-',
        format: item.format || '-',
        imageUrl: item.image_url || '',
        uploadedBy: item.uploaded_by || '-',
        uploadedOn: item.created_at ? new Date(item.created_at).toLocaleString() : '-',
      })),
    [resources]
  )

  const handleUpload = async () => {
    if (!title.trim()) {
      setFormError('Title is required')
      return
    }
    if (!fileUrl.trim()) {
      setFormError('Please provide a file URL or select a file')
      return
    }
    try {
      setSubmitting(true)
      setError('')
      setFormError('')
      await api('/lms/library-resources', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          grade,
          format,
          file_url: fileUrl.trim(),
          image_url: imageUrl.trim(),
        }),
      })
      setTitle('')
      setGrade(classOptions[0] || '')
      setFormat('PDF')
      setFileUrl('')
      setImageUrl('')
      setSelectedFileName('')
      setSelectedImageName('')
      setShowUploadModal(false)
      await fetchResources()
    } catch (err) {
      const message = err.message || 'Failed to upload resource'
      setError(message)
      setFormError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setFormError('File size should be 5MB or less')
      e.target.value = ''
      return
    }
    try {
      setFormError('')
      setSelectedFileName(file.name)
      const dataUrl = await fileToDataUrl(file)
      setFileUrl(dataUrl)
      const ext = (file.name.split('.').pop() || '').toUpperCase()
      if (ext) setFormat(ext)
    } catch (err) {
      setFormError(err.message || 'Failed to read file')
    }
  }

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file')
      e.target.value = ''
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image size should be 5MB or less')
      e.target.value = ''
      return
    }
    try {
      setFormError('')
      setSelectedImageName(file.name)
      const dataUrl = await fileToDataUrl(file)
      setImageUrl(dataUrl)
    } catch (err) {
      setFormError(err.message || 'Failed to read image')
    }
  }

  return (
    <div className="min-h-full bg-[#F7FAFD] p-4 sm:p-6 lg:p-7">
      <div className="rounded-[8px] border border-black/[0.08] bg-gradient-to-br from-white to-[#e8f5ff] p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-[12px] bg-[#e8f5ff] px-[10px] py-[6px] text-[12px] font-medium text-[#0f172a]">
              <BookOpen className="h-4 w-4 text-[#5b3df6]" />
              Admin managed library
            </div>
            <h2 className="mt-3 text-[26px] font-bold text-[#0f172a] sm:text-[30px]">E-Library Resource Uploads</h2>
            <p className="mt-2 text-[14px] text-[#64748b]">
              Library resources are uploaded and managed by admin only. Students can only view and download published files.
            </p>
          </div>
          <button
            onClick={() => {
              setFormError('')
              setShowUploadModal(true)
            }}
            className="inline-flex h-[40px] w-full items-center justify-center gap-2 rounded-[6px] bg-[#5b3df6] px-[16px] text-[14px] font-medium text-white hover:bg-[#4c2dd9] sm:w-auto"
          >
            <PlusCircle className="h-[18px] w-[18px]" />
            Upload library file
          </button>
        </div>
      </div>

      <section className="mt-6 rounded-[8px] border border-black/[0.08] bg-white p-5 sm:p-6">
        <h3 className="text-[18px] font-bold text-[#0f172a]">Uploaded resources</h3>
        <p className="mt-1 text-[13px] text-[#94a3b8]">Latest files available for students in E-Library.</p>

        {error ? <p className="mt-3 text-[13px] text-red-600">{error}</p> : null}

        <div className="mt-4 space-y-3">
          {loading ? <p className="text-[13px] text-[#64748b]">Loading resources...</p> : null}

          {!loading && normalizedResources.length === 0 ? (
            <p className="text-[13px] text-[#64748b]">No library resources available yet.</p>
          ) : null}

          {normalizedResources.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-[6px] border border-black/[0.08] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="h-10 w-10 rounded-[6px] object-cover border border-black/[0.08]" />
                ) : (
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#f1f5f9]">
                    <FileText className="h-5 w-5 text-[#5b3df6]" />
                  </div>
                )}
                <div>
                  <p className="text-[14px] font-semibold text-[#0f172a]">{item.title}</p>
                  <p className="mt-1 text-[12px] text-[#94a3b8]">
                    {item.grade} • {item.format} • Uploaded by {item.uploadedBy} • {item.uploadedOn}
                  </p>
                </div>
              </div>
              <span className="inline-flex h-[28px] items-center rounded-[12px] bg-[#2dd4bf] px-[10px] text-[12px] font-medium text-[#023b33]">
                Published
              </span>
            </div>
          ))}
        </div>
      </section>

      {showUploadModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-[95vw] max-w-[560px] rounded-[8px] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-black/[0.08] p-5">
              <h3 className="text-[18px] font-bold text-[#0f172a]">Upload library resource</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-[#94a3b8] hover:text-[#0f172a]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              {formError ? <p className="text-[13px] text-red-600">{formError}</p> : null}

              <div>
                <label className="mb-1 block text-[13px] font-semibold text-[#0f172a]">Title</label>
                <input
                  disabled={submitting}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter resource title"
                  className="h-10 w-full rounded-[6px] border border-black/[0.08] px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[13px] font-semibold text-[#0f172a]">Class</label>
                  {/* ✅ Dynamic class options from live_classes API */}
                  <select
                    disabled={submitting}
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="h-10 w-full rounded-[6px] border border-black/[0.08] px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                  >
                    {classOptions.length === 0 ? (
                      <option value="">Loading classes...</option>
                    ) : (
                      classOptions.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[13px] font-semibold text-[#0f172a]">Format</label>
                  <select
                    disabled={submitting}
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="h-10 w-full rounded-[6px] border border-black/[0.08] px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                  >
                    <option>PDF</option>
                    <option>DOCX</option>
                    <option>PPT</option>
                    <option>MP4</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[13px] font-semibold text-[#0f172a]">File URL (optional)</label>
                <input
                  disabled={submitting}
                  value={fileUrl}
                  onChange={(e) => {
                    setFormError('')
                    setFileUrl(e.target.value)
                    if (e.target.value.trim()) setSelectedFileName('')
                  }}
                  placeholder="https://..."
                  className="h-10 w-full rounded-[6px] border border-black/[0.08] px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                />
              </div>

              <div>
                <label className="mb-1 block text-[13px] font-semibold text-[#0f172a]">Image URL (optional)</label>
                <input
                  disabled={submitting}
                  value={imageUrl}
                  onChange={(e) => {
                    setFormError('')
                    setImageUrl(e.target.value)
                    if (e.target.value.trim()) setSelectedImageName('')
                  }}
                  placeholder="https://..."
                  className="h-10 w-full rounded-[6px] border border-black/[0.08] px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                />
              </div>

              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-[6px] border border-dashed border-[#94a3b8] bg-[#f8fafc] p-4 text-[13px] font-medium text-[#64748b]">
                <Upload className="h-4 w-4" />
                {selectedFileName ? `Selected: ${selectedFileName}` : 'Choose file (max 5MB)'}
                <input type="file" className="hidden" onChange={handleFileSelect} disabled={submitting} />
              </label>

              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-[6px] border border-dashed border-[#94a3b8] bg-[#f8fafc] p-4 text-[13px] font-medium text-[#64748b]">
                <Upload className="h-4 w-4" />
                {selectedImageName ? `Selected image: ${selectedImageName}` : 'Choose image (max 5MB)'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} disabled={submitting} />
              </label>

              {imageUrl ? (
                <img src={imageUrl} alt="Preview" className="h-32 w-full rounded-[6px] border border-black/[0.08] object-cover" />
              ) : null}
            </div>

            <div className="flex flex-col gap-3 border-t border-black/[0.08] p-5 sm:flex-row">
              <button
                disabled={submitting}
                onClick={() => setShowUploadModal(false)}
                className="h-10 flex-1 rounded-[6px] border border-black/[0.08] text-[13px] font-medium text-[#64748b] hover:bg-[#f8fafc]"
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                onClick={handleUpload}
                className="h-10 flex-1 rounded-[6px] bg-[#5b3df6] text-[13px] font-medium text-white hover:bg-[#4c2dd9]"
              >
                {submitting ? 'Publishing...' : 'Publish resource'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}