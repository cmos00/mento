"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, ArrowLeft, Upload, X, Save, Eye } from 'lucide-react'
import MobileBottomNav from '@/components/MobileBottomNav'
import PCNavigation from '@/components/PCNavigation'

export default function JournalWritePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDraft, setIsDraft] = useState(false)

  const categories = [
    '커리어 전환',
    '리더십',
    '디자인',
    '개발',
    '스타트업',
    '워크라이프'
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.')
      return
    }

    // 실제로는 API 호출
    console.log('저널 글 작성:', {
      title,
      content,
      category,
      tags,
      image,
      isDraft
    })

    alert(isDraft ? '임시저장되었습니다.' : '글이 발행되었습니다.')
    
    // 저널 페이지로 이동
    window.location.href = '/journal'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* PC Navigation */}
      <PCNavigation title="저널" icon={BookOpen} />
      
      {/* Mobile Header */}
      <header className="md:hidden bg-white/80 backdrop-blur-sm border-b border-purple-100 px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/journal" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span>저널로 돌아가기</span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Back Button (PC) */}
        <div className="hidden md:block mb-6">
          <Link href="/journal" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>저널로 돌아가기</span>
          </Link>
        </div>

        {/* Write Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 md:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">새 저널 글 작성</h1>
            
            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">카테고리를 선택하세요</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                태그
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-purple-500 hover:text-purple-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="태그를 입력하고 Enter를 누르세요"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  추가
                </button>
              </div>
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대표 이미지
              </label>
              {imagePreview ? (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={800}
                    height={256}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">이미지를 업로드하세요</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors cursor-pointer"
                  >
                    이미지 선택
                  </label>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용 *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요 (마크다운 문법 지원)"
                rows={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                마크다운 문법을 사용할 수 있습니다. (# 제목, **굵게**, *기울임* 등)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isDraft}
                    onChange={(e) => setIsDraft(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">임시저장</span>
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  미리보기
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isDraft ? '임시저장' : '발행하기'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}