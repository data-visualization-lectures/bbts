'use client'
import { useCallback, useState } from 'react'
import useStore from '@/app/store/useStore'
import { parseCsv } from '@/app/utils/csvParser'
import { useI18n } from '@/app/i18n'

const ERROR_KEYS = {
  'データが空です': 'upload.emptyData',
}

export default function DataUpload() {
  const addTrack = useStore((s) => s.addTrack)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { t } = useI18n()

  const translateError = (msg) => {
    const key = ERROR_KEYS[msg]
    return key ? t(key) : msg
  }

  const processFiles = useCallback(
    async (files) => {
      setError(null)
      setLoading(true)
      try {
        for (const file of files) {
          const text = await file.text()
          const tracks = parseCsv(text, file.name)
          tracks.forEach((tr) => addTrack(tr))
        }
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    },
    [addTrack]
  )

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragging(false)
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.name.endsWith('.csv')
      )
      if (files.length === 0) {
        setError(t('upload.csvRequired'))
        return
      }
      processFiles(files)
    },
    [processFiles, t]
  )

  const onFileChange = (e) => {
    const files = Array.from(e.target.files)
    processFiles(files)
    e.target.value = ''
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('upload.heading')}</h3>
      <p className="text-xs text-gray-500">{t('upload.description')}</p>

      {/* ファイルアップロード */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          dragging
            ? 'border-cyan-400 bg-cyan-900/20'
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onClick={() => document.getElementById('file-input').click()}
      >
        <div className="text-2xl mb-1">📂</div>
        <p className="text-xs text-gray-400">
          {loading ? t('upload.loading') : t('upload.dropzone')}
        </p>
        <p className="text-xs text-gray-600 mt-1">{t('upload.compatible')}</p>
        <input
          id="file-input"
          type="file"
          accept=".csv"
          multiple
          className="hidden"
          onChange={onFileChange}
          disabled={loading}
        />
      </div>

      {/* サンプルデータはツールヘッダーに移行済み */}
      {error && (
        <p className="text-xs text-red-400 bg-red-900/20 rounded px-2 py-1">{translateError(error)}</p>
      )}
    </div>
  )
}
