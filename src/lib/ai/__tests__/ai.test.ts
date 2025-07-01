import { generateAIText } from '../index'

describe('AI helpers', () => {
  it('throws when api key missing', async () => {
    const original = process.env.OPENAI_API_KEY
    delete process.env.OPENAI_API_KEY
    await expect(generateAIText('test')).rejects.toThrow('OpenAI API key')
    if (original) process.env.OPENAI_API_KEY = original
  })
})
