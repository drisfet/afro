import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { streamText } from 'ai'
import { getModel, safetySettings, systemPrompt, DEFAULT_MODEL_ID, type ModelId, AVAILABLE_MODELS } from '../../../../lib/ai/config.server'

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const body = req.body as { messages: any[]; modelId?: ModelId }
    const { messages, modelId = DEFAULT_MODEL_ID } = body

    console.log('AI chat request:', { messageCount: messages?.length, modelId })

    // Validate model ID
    if (modelId && !AVAILABLE_MODELS[modelId]) {
      res.status(400).json({
        error: 'Invalid model ID',
        availableModels: Object.keys(AVAILABLE_MODELS)
      })
      return
    }

    // Get the appropriate model instance
    const model = getModel(modelId)

    // Convert messages - handle both old format (content) and new format (parts)
    const coreMessages = messages.map((msg: any) => {
      // New format with parts array
      if (msg.parts) {
        const textParts = msg.parts
          .filter((part: any) => part.type === 'text')
          .map((part: any) => part.text)
          .join('\n')
        
        return {
          role: msg.role,
          content: textParts
        }
      }
      
      // Old format with content string
      return {
        role: msg.role,
        content: msg.content || msg.text || ''
      }
    })

    console.log('Streaming AI response...')

    const result = streamText({
      model,
      messages: coreMessages,
      system: systemPrompt,
      providerOptions: {
        google: {
          safetySettings,
        },
      },
    })

    // Return streaming response in the format expected by DefaultChatTransport
    const response = result.toTextStreamResponse()
    
    // Copy response to res object for MedusaJS
    response.headers.forEach((value, key) => {
      res.setHeader(key, value)
    })
    res.status(response.status)
    
    // Pipe the stream
    if (response.body) {
      const reader = response.body.getReader()
      const pump = async () => {
        const { done, value } = await reader.read()
        if (done) {
          res.end()
          return
        }
        res.write(value)
        pump()
      }
      pump()
    }
  } catch (error) {
    console.error('AI chat error:', error)
    res.status(500).json({
      error: 'AI service error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

