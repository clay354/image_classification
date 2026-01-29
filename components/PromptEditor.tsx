"use client";

import { DEFAULT_PROMPT } from "@/lib/types";

interface PromptEditorProps {
  prompt: string;
  onPromptChange: (value: string) => void;
}

export default function PromptEditor({
  prompt,
  onPromptChange,
}: PromptEditorProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">프롬프트 편집</h2>
        <button
          onClick={() => onPromptChange(DEFAULT_PROMPT)}
          className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          초기화
        </button>
      </div>
      <textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        rows={8}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        placeholder="AI 분석 프롬프트를 입력하세요..."
      />
    </div>
  );
}
