// Chat Message Component

import { Text } from "@medusajs/ui"

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 border ${
          isUser
            ? 'bg-ui-bg-interactive text-ui-fg-on-color border-ui-border-interactive'
            : 'bg-ui-bg-base text-ui-fg-base border-ui-border-base'
        }`}
      >
        <Text size="small" className={isUser ? 'text-ui-fg-on-color' : 'text-ui-fg-base'}>
          {content}
        </Text>
      </div>
    </div>
  )
}