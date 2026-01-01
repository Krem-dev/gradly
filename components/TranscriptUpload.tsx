'use client'

import { useState } from 'react'
import { Upload, FileText, CheckCircle, Lock, AlertCircle } from 'lucide-react'

interface ExtractedCourse {
  name: string
  code: string | null
  credits: number
  grade: string
  score: number | null
  semester: string
}

interface TranscriptUploadProps {
  onUpload?: (file: File) => void
  onUpgrade?: () => void
  isLoading?: boolean
  isPremium?: boolean
  onCoursesExtracted?: (courses: ExtractedCourse[]) => void
}

export default function TranscriptUpload({ onUpload, onUpgrade, isLoading = false, isPremium = false, onCoursesExtracted }: TranscriptUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedCourses, setExtractedCourses] = useState<ExtractedCourse[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = async (file: File) => {
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      setUploadedFile(file)
      setError(null)
      setExtractedCourses([])
      onUpload?.(file)
      
      await processTranscript(file)
    }
  }

  const processTranscript = async (file: File) => {
    setIsProcessing(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('transcript', file)
      
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${backendUrl}/transcript/parse`, {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (!data.success) {
        setError(data.error || 'Failed to parse transcript')
        setIsProcessing(false)
        return
      }
      
      const courses = data.courses || []
      setExtractedCourses(courses)
      onCoursesExtracted?.(courses)
      
      console.log('Extracted Courses:', courses)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to process transcript'
      setError(errorMsg)
      console.error('Transcript processing error:', err)
    } finally {
      setIsProcessing(false)
    }
  }


  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-dashed border-gray-300 p-4">
        {!uploadedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`text-center transition-all ${
            isDragActive ? 'bg-primary bg-opacity-5 border-primary' : ''
          }`}
        >
          <div className="flex justify-center mb-2">
            <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary" />
            </div>
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">Upload Transcript (Optional)</h3>
          <p className="text-xs text-gray-600 mb-3">
            Drag PDF or click to browse
          </p>
          <label className="inline-block">
            <input
              type="file"
              accept=".pdf"
              onChange={handleChange}
              className="hidden"
              disabled={isLoading}
            />
            <span className="px-3 py-1.5 rounded font-semibold bg-primary text-white hover:bg-opacity-90 transition-all text-xs cursor-pointer inline-block">
              {isLoading ? 'Processing...' : 'Select File'}
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-2">PDF only</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">File Uploaded</h3>
          <div className="flex items-center justify-center gap-2 mb-3 text-gray-700">
            <FileText className="w-3 h-3" />
            <span className="text-xs font-semibold truncate">{uploadedFile.name}</span>
          </div>
          <button
            onClick={() => setUploadedFile(null)}
            className="px-3 py-1.5 rounded font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all text-xs"
          >
            Change File
          </button>
        </div>
      )}
      </div>

    </div>
  )
}
